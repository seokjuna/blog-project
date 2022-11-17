import Responsive from "../components/common/Responsive";
import EditorContainer from "../containers/write/EditorContainer";
import TagBoxContainer from "../containers/write/TagBoxContainer";
import WriteActionsButtonsContainer from "../containers/write/WriteActionButtonsContainer";

const WritePage = () => {
    return (
        <Responsive>
            <EditorContainer />
            <TagBoxContainer />
            <WriteActionsButtonsContainer />
        </Responsive>
    )
};

export default WritePage;