import { useLocation, useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCourseContent } from '../../api/courses';
import './SideMenu.css';

function SideMenu() {
    const { courseId } = useParams();
    const location = useLocation();
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                setLoading(true);

                // Если мы на странице курса
                if (courseId && location.pathname.startsWith('/course/')) {
                    const data = await getCourseContent(courseId);
                    setChapters(data.chapters);
                    setError(null);
                } else {
                    setChapters([]);
                }
            } catch (err) {
                setError('Не удалось загрузить содержание курса');
                setChapters([]);
            } finally {
                setLoading(false);
            }
        };

        fetchChapters();
    }, [courseId, location.pathname]); // Используем location.pathname вместо location

    if (loading) {
        return (
            <aside className="side-menu">
                <div className="loading-message">Загрузка содержания...</div>
            </aside>
        );
    }

    if (error) {
        return (
            <aside className="side-menu">
                <div className="error-message">{error}</div>
            </aside>
        );
    }

    return (
        <aside className="side-menu">
            {chapters.length > 0 ? (
                <div className="course-contents">
                    <h3>Содержание курса</h3>
                    <ul>
                        {chapters.map(chapter => (
                            <li key={chapter.id}>
                                <Link
                                    to={`/course/${courseId}/chapter/${chapter.id}`}
                                    className="chapter-link"
                                >
                                    {chapter.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="empty-menu"/>
            )}
        </aside>
    );
}

export default SideMenu;