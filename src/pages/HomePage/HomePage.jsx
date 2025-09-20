import { useState, useEffect } from 'react';
import CourseCard from '../../components/CourseCard/CourseCard';
import { getAllCourses } from '../../api/courses';
import './HomePage.css';

function HomePage({author}) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllCourses()
            .then(data => {
                setCourses(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="home-page">
            <div className="home-page-header">Доступные курсы:</div>
            {loading ? (
                <div>Загрузка курсов...</div>
            ) : (
                <div className="courses-grid">
                    {courses.filter(course => author === "all" || course.author === author).map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default HomePage;