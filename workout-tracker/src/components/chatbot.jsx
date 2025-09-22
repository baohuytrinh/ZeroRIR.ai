import React, { useState } from 'react';

function Chatbot() {
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [position, setPosition] = useState({ x: 10, y: 10 });
    const [size, setSize] = useState({ width: 350, height: 500 });
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

    const formatMessage = (text) => {
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
        let formatted = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
        formatted = formatted.replace(/\n/g, '<br>');
        
        return (
            <div key={index} style={{ marginBottom: '10px' }}>
                <span dangerouslySetInnerHTML={{ __html: formatted }} />
            </div>
        );
    });
};

    const sendMessage = async() => {
        if (!prompt.trim()) return;
        setLoading(true);
        setMessages([...messages, { from: 'user', text: prompt}]);
        setPrompt('');

        try {
            const res = await fetch('http://localhost:8000/api/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();
            setMessages((msgs) => [...msgs, { from: 'ai', text: data.ai}]);
            setLoading(false);
        } catch (err) {
            setMessages((msgs) => [...msgs, {from: 'ai', text: 'Error: Could not get response.'}]);
            setLoading(false);
        }
    };

    const handleMouseDown = (e) => {
        if (e.target.closest('.resize-handle') || e.target.closest('input') || e.target.closest('button')) return;
        setIsDragging(true);
        setDragStart({
            x: e.clientX + position.x,
            y: e.clientY + position.y
        });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: dragStart.x - e.clientX,
                y: dragStart.y - e.clientY
            });
        }
        if (isResizing) {
            const newWidth = Math.max(300, resizeStart.width - (e.clientX - resizeStart.x));
            const newHeight = Math.max(200, resizeStart.height - (e.clientY - resizeStart.y));
            setSize({ width: newWidth, height: newHeight });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
    };

    const handleResizeStart = (e) => {
        e.stopPropagation();
        setIsResizing(true);
        setResizeStart({
            x: e.clientX,
            y: e.clientY,
            width: size.width,
            height: size.height
        });
    };

    //global mouse event listener
    React.useEffect(() => {
        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, isResizing, dragStart, resizeStart]);

    const minimizedStyle = {
        position: 'fixed',
        bottom: position.y,
        right: position.x,
        width: 200,
        height: 40,
        background: 'radial-gradient(ellipse at center, #122946 0%, #10111a 100%)',
        border: '1px solid rgb(170, 165, 230)',
        borderRadius: 10,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 10px',
        cursor: isDragging ? 'grabbing' : 'grab',
        color: 'white'
    };

    const expandedStyle = {
        position: 'fixed',
        bottom: position.y,
        right: position.x,
        width: size.width,
        height: size.height,
        background: 'radial-gradient(ellipse at center, #122946 0%, #10111a 100%)',
        border: '1px solid rgb(170, 165, 230)',
        borderRadius: 10,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        cursor: isDragging ? 'grabbing' : 'default',
        color: 'white',
        userSelect: 'none'
    };

    if (isMinimized) {
        return (
            <div 
                style={minimizedStyle}
                onMouseDown={handleMouseDown}
            >
                <span>Personal AI Trainer</span>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMinimized(false);
                    }}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    ↗
                </button>
            </div>
        );
    }

    return (
        <div style={expandedStyle}>
            {/* header (title/minimize) */}
            <div 
                style={{ 
                    padding: '10px', 
                    borderBottom: '1px solid rgba(170, 165, 230, 0.3)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: isDragging ? 'grabbing' : 'grab'
                }}
                onMouseDown={handleMouseDown}
            >
                <b>Personal AI Trainer</b>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <button 
                        onClick={() => setIsMinimized(true)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '14px',
                            padding: '2px 6px',
                            borderRadius: '3px'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                        −
                    </button>
                </div>
            </div>
            
            {/* msgs */}
            <div style={{ 
                flex: 1, 
                overflowY: 'auto', 
                padding: 10,
                userSelect: 'text'
            }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        textAlign: 'left',
                        margin: '12px 0',
                        color: msg.from === 'user' ? '#1976d2' : 'white',
                        lineHeight: '1.5',
                        wordWrap: 'break-word'
                    }}>
                        <div style={{ 
                            fontWeight: 'bold', 
                            marginBottom: '4px',
                            fontSize: '14px'
                        }}>
                            {msg.from === 'user' ? 'You' : 'AI'}:
                        </div>
                        <div style={{ 
                            paddingLeft: '8px',
                            borderLeft: msg.from === 'user' ? '3px solid #1976d2' : '3px solid rgba(170, 165, 230, 0.5)'
                        }}>
                            {msg.from === 'ai' ? formatMessage(msg.text) : msg.text}
                        </div>
                    </div>
                ))}
                {loading && <div style={{ color: '#888', fontStyle: 'italic', padding: '10px' }}>AI is typing...</div>}
            </div>
            
            {/* input */}
            <div style={{ 
                display: 'flex', 
                borderTop: '1px solid rgba(170, 165, 230, 0.3)', 
                padding: 8 
            }}>
                <input
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask me anything..."
                    style={{ 
                        flex: 1, 
                        border: 'none', 
                        outline: 'none', 
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '4px'
                    }}
                />
                <button 
                    onClick={sendMessage} 
                    disabled={loading || !prompt.trim()}
                    style={{
                        marginLeft: '8px',
                        padding: '8px 12px',
                        background: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
                        opacity: loading || !prompt.trim() ? 0.5 : 1
                    }}
                >
                    Send
                </button>
            </div>
            
            {/* resize */}
            <div 
                className="resize-handle"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 10,
                    height: 10,
                    cursor: 'nw-resize',
                    background: 'rgba(170, 165, 230, 0.3)',
                    borderRadius: '10px 0 0 0'
                }}
                onMouseDown={handleResizeStart}
            />
        </div>
    );
}

export default Chatbot;