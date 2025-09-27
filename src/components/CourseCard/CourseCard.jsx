import { Link } from 'react-router-dom';
import './CourseCard.css';

function CourseCard({ course }) {
    const year_descr = course.year + (course.level === "bac" ? " курс бакалавриата" : " курс магистратуры");
    return (
        <div className="course-card">
            <div>
                <Link to={`/course/${course.id}`} className="course-card-link">
                    <button className="course-card-button">
                        <div className="year_descr">{year_descr}</div>
                        <h3>{course.title}</h3>
                        <h4>{course.description}</h4>
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default CourseCard;