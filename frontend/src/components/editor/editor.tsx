import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  codeBlockPlugin,
  codeMirrorPlugin,
  CodeToggle,
  CreateLink,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  directivesPlugin,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  InsertAdmonition,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  MDXEditorMethods,
  quotePlugin,
  RealmPlugin,
  Separator,
  StrikeThroughSupSubToggles,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import { CalloutDirectiveDescriptor } from "./directives";

interface Props {
  image?: boolean;
  table?: boolean;

  startText?: string;
  readOnly?: boolean;
  diffText?: string;
  editorRef?: React.Ref<MDXEditorMethods>;
  onChange?: (markdown: string) => void;
}


export const MyDXEditor: React.FC<Props> = ({ image, table, editorRef, onChange, diffText, readOnly, startText }) => {
  const plugins: RealmPlugin[] = [];
  plugins.push(directivesPlugin(
    {
      directiveDescriptors: [
        CalloutDirectiveDescriptor,
      ]
    }
  ));

  plugins.push(frontmatterPlugin());
  plugins.push(headingsPlugin());
  plugins.push(listsPlugin());
  plugins.push(markdownShortcutPlugin());
  plugins.push(quotePlugin());
  plugins.push(thematicBreakPlugin());

  plugins.push(linkPlugin());
  plugins.push(linkDialogPlugin());

  if (table ?? true) {
    plugins.push(tablePlugin());
  }

  if (image ?? true) {
    plugins.push(imagePlugin({
      imageUploadHandler: (image: File) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error("Falha ao ler o arquivo como string"));
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(image);
        });
      },
    }));
  }

  plugins.push(diffSourcePlugin({
    diffMarkdown: diffText,
    viewMode: 'rich-text'
  }));

  plugins.push(codeBlockPlugin({ defaultCodeBlockLanguage: 'dart' }));

  plugins.push(codeMirrorPlugin({
    codeBlockLanguages: {
      dart: "Flutter",
      js: 'JS',
      python: "Python",
      c: "C/C++",
      txt: 'text',
      tsx: 'TypeScript'
    },
  }));

  if (!readOnly) {
    plugins.push(toolbarPlugin({
      toolbarContents: () => <>
        {!readOnly && <DiffSourceToggleWrapper options={['rich-text', 'diff', 'source']}>
          <UndoRedo />
          <Separator />
          <BoldItalicUnderlineToggles />
          <Separator />
          <StrikeThroughSupSubToggles />
          <Separator />
          <ListsToggle />
          <Separator />
          <BlockTypeSelect />
          <Separator />
          <CreateLink />
          {(image ?? true) && <InsertImage />}
          <Separator />
          {(table ?? true) && <InsertTable />}
          <InsertThematicBreak />
          <Separator />
          <CodeToggle />
          <InsertCodeBlock />
          <Separator />
          <InsertAdmonition />
          <Separator />
        </DiffSourceToggleWrapper>}
      </>
    }),
    );
  }

  return <MDXEditor
    ref={editorRef}
    plugins={plugins}
    readOnly={readOnly}
    markdown={startText ?? ""}
    onChange={(text) => onChange && onChange(text)}
  />
};