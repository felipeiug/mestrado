import { DirectiveDescriptor, NestedLexicalEditor } from "@mdxeditor/editor";
import { Card, useTheme } from "@mui/material";
import { PhrasingContent } from 'mdast';
import { Directives } from 'mdast-util-directive';
import { useAppThemeContext } from "../../context";

type EditorType = "note" | "tip" | "danger" | "info" | "caution";

export const CalloutDirectiveDescriptor: DirectiveDescriptor = {
    name: 'Generic',
    testNode: () => true,
    attributes: [],
    hasChildren: true,
    Editor: (node) => <EditorItem type={node.mdastNode.name as EditorType} />,
};

const EditorItem: React.FC<{ type: EditorType; }> = ({ type }) => {
    const { themeType } = useAppThemeContext();
    const { palette } = useTheme();

    let bgCard = themeType ? "#F9E66B" : "#333333";
    let bgText = palette.background.default;
    let textColor = undefined;

    if (type === "caution") {
        bgCard = palette.warning.main;
    } else if (type === "danger") {
        bgCard = palette.error.main;
        textColor = palette.getContrastText(bgText);
    } else if (type === "info") {
        bgCard = palette.secondary.main;
        bgText = palette.secondary.main;
        textColor = palette.info.contrastText;
    } else if (type === "note") {
        bgCard = themeType ? "#F9E66B" : "#333333";
        bgText = themeType ? "#F9E66B" : "#333333";
        textColor = palette.getContrastText(bgText);
    } else if (type === "tip") {
        bgCard = palette.success.main;
    }


    return (
        <Card style={{
            padding: 8,
            margin: 8,
            backgroundColor: bgCard,
            color: textColor,
        }}>
            <NestedLexicalEditor<Directives>
                block
                contentEditableProps={{
                    style: {
                        backgroundColor: bgText,
                        color: textColor,
                    }
                }}
                getContent={(node) => node.children as PhrasingContent[]}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                getUpdatedMdastNode={(mdastNode, children: any) => {
                    return { ...mdastNode, children };
                }}
            />
        </Card>
    );
};