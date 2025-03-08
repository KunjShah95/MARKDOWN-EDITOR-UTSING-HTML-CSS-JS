
document.addEventListener('DOMContentLoaded', function() {
  const editor = document.getElementById('markdown-editor');
  const preview = document.getElementById('markdown-preview');
  const lineNumbers = document.querySelector('.line-numbers');
  const resizer = document.getElementById('dragMe');
  const editorPanel = document.querySelector('.editor-panel');
  const previewPanel = document.querySelector('.preview-panel');
  const editorContainer = document.querySelector('.editor-container');

  // Configure marked.js
  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    highlight: function(code, language) {
      if (language && hljs.getLanguage(language)) {
        try {
          return hljs.highlight(code, { language }).value;
        } catch (err) {}
      }
      return hljs.highlightAuto(code).value;
    }
  });

  // Initial render
  renderMarkdown();
  updateLineNumbers();

  // Event listeners
  editor.addEventListener('input', function() {
    renderMarkdown();
    updateLineNumbers();
  });

  editor.addEventListener('scroll', function() {
    // Sync line numbers with editor scroll
    lineNumbers.scrollTop = editor.scrollTop;
  });

  // Resizable panels
  let isResizing = false;
  let lastX = 0;
  let containerWidth = editorContainer.clientWidth;

  resizer.addEventListener('mousedown', function(e) {
    isResizing = true;
    lastX = e.clientX;
    document.body.style.cursor = 'col-resize';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    // Prevent text selection while resizing
    e.preventDefault();
  });

  function handleMouseMove(e) {
    if (!isResizing) return;
    
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    
    const leftWidth = editorPanel.offsetWidth + dx;
    const rightWidth = previewPanel.offsetWidth - dx;
    
    // Ensure minimum widths
    const minWidth = containerWidth * 0.3;
    
    if (leftWidth >= minWidth && rightWidth >= minWidth) {
      editorPanel.style.flexBasis = `${leftWidth}px`;
      previewPanel.style.flexBasis = `${rightWidth}px`;
    }
  }

  function handleMouseUp() {
    isResizing = false;
    document.body.style.cursor = '';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }

  // Update on resize
  window.addEventListener('resize', function() {
    containerWidth = editorContainer.clientWidth;
    updateLineNumbers();
  });

  // Render markdown
  function renderMarkdown() {
    const rawMarkdown = editor.value;
    const html = marked.parse(rawMarkdown);
    preview.innerHTML = html;
    
    // Apply syntax highlighting to code blocks
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }

  // Update line numbers
  function updateLineNumbers() {
    const lines = editor.value.split('\n');
    const lineCount = lines.length;
    let lineNumbersHTML = '';
    
    for (let i = 1; i <= lineCount; i++) {
      lineNumbersHTML += `<div>${i}</div>`;
    }
    
    lineNumbers.innerHTML = lineNumbersHTML;
  }
});
