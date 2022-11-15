import Joi from "../../../node_modules/joi/lib/index";
import User from "../../models/user";

/* 회원가입
POST /api/auth/register
{
    username: 'naseokju',
    password: 'pass111'
}
*/
export const register = async ctx => {
    // Request Body 검증하기
    const schema = Joi.object().keys({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(20)
            .required(),
        password: Joi.string().required(),
    });
    const result = schema.validate(ctx.request.body);
    if (result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }
    
    const { username, password } = ctx.request.body;
    try {
        // username이 이미 존재하는지 확인
        const exists = await User.findByUsername(username);
        if (exists) {
            ctx.status = 409; // Conflict
        }

        const user = new User({
            username,
        });
        await user.setPassword(password); // 비밀번호 설정
        await user.save(); // db에 저장

        ctx.body = user.serialize();

        const token = user.generateToken();
        ctx.cookies.set('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
            httpOnly: true,
        });
    } catch (e) {
        ctx.throw(500, e);
    }
};

/* 로그인
POST /api/auth/login
{
    username: 'naseokju123',
    password: 'pass123'
}
*/
export const login = async ctx => {
    const { username, password } = ctx.request.body;

    // username, password가 없으면 에러 처리
    if (!username || !password) {
        ctx.status = 401; // Unauthroized
        return;
    }

    try {
        const user = await User.findByUsername(username);
        // 계정이 존재하지 않으면 에러 처리
        if (!user) {
            ctx.status = 401;
            return;
        }
        const valid = await user.checkPassword(password);
        // 잘못된 비밀번호
        if(!valid) {
            ctx.status = 401;
            return;
        }
        ctx.body = user.serialize();
        
        const token = user.generateToken();
        ctx.cookies.set('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
            httpOnly: true,
        });
    } catch (e) {
        ctx.throw(500, e);
    }
};

/* 로그인 상태 확인
GET /api/auth/check
*/
export const check = async ctx => {
    const { user } = ctx.state;
    if (!user) {
        // 로그인 중 아님
        ctx.status = 401; // Unauthorized
        return;
    } 
    ctx.body = user;
};

/* 로그아웃
POST /api/auth/logout
*/
export const logout = async ctx => {
    ctx.cookies.set('access_token');
    ctx.status = 204;
};