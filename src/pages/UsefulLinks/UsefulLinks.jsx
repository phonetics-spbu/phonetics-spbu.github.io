import { useState, useEffect } from 'react';
import './UsefulLinks.css';
import SideMenu from "../../components/SideMenu/SideMenu";

function UsefulLinks() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Load HTML content from public directory
        fetch(`${process.env.PUBLIC_URL}/courses/useful_links.html`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to load content');
                return response.text();
            })
            .then(html => {
                setContent(html);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div className="chapter-page">
            <div className="chapter-page-content">
                <h2>Полезные ссылки</h2>
                {loading && <div className="loading">Загрузка...</div>}
                {error && <div className="error">Ошибка: {error}</div>}
                {!loading && !error && (
                    <div
                        className="chapter-content"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                )}
            </div>
            <div className="mobile_side_menu"><SideMenu /></div>
        </div>
    );
}

export default UsefulLinks;