import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'
import 'katex/dist/katex.min.css'

interface MarkdownPreviewProps {
  markdown: string
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ markdown }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">
        预览效果
      </h2>
      <div className="markdown-preview overflow-auto max-h-[600px]">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeHighlight]}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default MarkdownPreview
