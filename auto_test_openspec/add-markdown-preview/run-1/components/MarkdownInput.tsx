interface MarkdownInputProps {
  markdown: string
  setMarkdown: (value: string) => void
}

const MarkdownInput: React.FC<MarkdownInputProps> = ({
  markdown,
  setMarkdown,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">
        Markdown 输入
      </h2>
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        className="w-full h-full min-h-[600px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
        placeholder="在这里输入 Markdown 文本..."
      />
    </div>
  )
}

export default MarkdownInput
