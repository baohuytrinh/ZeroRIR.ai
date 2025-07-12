import React, { use, useState }from 'react';

function Chatbot() {

    const [prompt, setPrompt] =useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    //call backend ai endpoint
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
            setMessages((msgs) => [...msgs, { from: 'ai', text: data.ai}])
        } catch (err) {
            setMessages((msgs) => [...msgs, {from: 'ai', text: 'Error: Could not get response.'}]);
        }
        setLoading(false);
    }

  return (
    <div style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 320,
        height: 400,
        background: 'radial-gradient(ellipse at center, #122946 0%, #10111a 100%)',
        border: '1px solid #ccc',
        borderRadius: 10,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
        <div style = {{flex: 1, overflowY: 'auto', padding: 10}}>
            {messages.map((msg,idx) => (
                <div key={idx} style={{
                    textAlign: msg.from === 'user' ? 'right' : 'left',
                    margin: '6px 0',
                    color: msg.from === 'user' ? '#1976d2' : 'white',
                }}>
                    <b>{msg.from === 'user' ? 'You' : 'AI'}:</b> {msg.text}
                </div>
            ))}
            {loading && <div>AI is typing...</div>}
        </div>
        <div style={{ display: 'flex', borderTop: '1px solid #eee', padding: 8 }}>
        <input
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me anything..."
          style={{ flex: 1, border: 'none', outline: 'none' }}
        />
        <button onClick={sendMessage} disabled={loading || !prompt.trim()}>
          Send
        </button>
      </div>
    </div>
  )
}

export default Chatbot;