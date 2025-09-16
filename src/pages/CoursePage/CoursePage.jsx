import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getCourseDetails } from '../../api/courses';
import './CoursePage.css';
import SideMenu from "../../components/SideMenu/SideMenu";

function CoursePage() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    console.log("courseId", courseId)

    useEffect(() => {
        getCourseDetails(courseId)
            .then(data => {
                setCourse(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [courseId]);

    if (loading) return <div>Загрузка курса...</div>;
    if (!course) return <div>Курс не найден</div>;

    return (
        <div className="course-page">
            <SideMenu />
            <div className="course-page-content">
                <h2>{course.title}</h2>
                <p className="course-description">{course.description}</p>
            </div>
        </div>
    );
}

export default CoursePage;