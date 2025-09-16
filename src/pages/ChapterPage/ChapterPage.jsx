import {useParams} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {getCourseDetails} from '../../api/courses';
import './ChapterPage.css';
import SideMenu from "../../components/SideMenu/SideMenu";
import {MathJaxContext} from "better-react-mathjax";

function ChapterPage() {
    const {courseId, chapterId} = useParams();
    const [chapter, setChapter] = useState(null);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Загружаем метаданные главы
        getCourseDetails(courseId)
            .then(course => {
                const foundChapter = course.chapters.find(ch => ch.id === parseInt(chapterId));
                if (!foundChapter) {
                    throw new Error('Chapter not found');
                }
                setChapter(foundChapter);

                // Загружаем HTML-контент из public
                return fetch(`${process.env.PUBLIC_URL}/courses/${courseId}/${foundChapter.filename}`);
            })
            .then(response => {
                if (!response.ok) throw new Error('Failed to load chapter content');
                return response.text();
            })
            // .then(html => {
            //     setContent(html);
            //     setLoading(false);
            // })
            .then(html => {
                // Фикс путей к изображениям
                const fixedHtml = html.replaceAll(
                  /src="img\//g, 
                  `src="${process.env.PUBLIC_URL}/courses/${courseId}/img/`
                );
                console.log("html", process.env.PUBLIC_URL, `src="${process.env.PUBLIC_URL}/courses/${courseId}/img/`)
                setContent(fixedHtml);
                setLoading(false);
              })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [courseId, chapterId]);

    if (loading) return <div className="loading">Загрузка главы...</div>;
    if (error) return <div className="error">Ошибка: {error}</div>;
    if (!chapter) return <div className="error">Глава не найдена</div>;

    return (
        <div className="chapter-page">
            <SideMenu/>
            <div className="chapter-page-content">
                <h2>{chapter.title}</h2>
                <MathJaxContext>
                    <div className="chapter-content"
                         dangerouslySetInnerHTML={{__html: content}}
                    />
                </MathJaxContext>
            </div>
        </div>
    );
}

export default ChapterPage;