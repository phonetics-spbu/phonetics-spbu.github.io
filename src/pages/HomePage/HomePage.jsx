import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../../components/CourseCard/CourseCard';
import { getAllCourses } from '../../api/courses';
import './HomePage.css';

function HomePage({author}) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedProf, setSelectedProf] = useState('all');
    const [selectedLvl, setSelectedLvl] = useState('all-lvls');

    const handleChangeProf = (event) => {
        setSelectedProf(event.target.selectedOptions[0].id);
    };

    const handleChangeLvl = (event) => {
        setSelectedLvl(event.target.selectedOptions[0].id);
    };

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
            <nav>
                 <select id="prof" className="select-button" onChange={handleChangeProf}>
                      <option id="all">Преподаватель</option>
                      <option id="tityushina">Титюшина А.О.</option>
                      <option id="kholyavin">Холявин П.А.</option>
                 </select>
                 <select id="level" className="select-button" onChange={handleChangeLvl}>
                      <option id="all-lvls">Все курсы</option>
                      <option id="bac">Бакалавриат</option>
                      <option id="mag">Магистратура</option>
                 </select>
                 {author === 'all' ?
                        <Link to={`/useful_links`} className="useful-links">
                            <button className="select-button">
                                <div>Полезные ссылки</div>
                            </button>
                        </Link> : <div></div>
            }
            </nav>
            <div className="home-page-header">Доступные курсы:</div>
            {loading ? (
                <div>Загрузка курсов...</div>
            ) : (
                <div>
                    <div className="courses-grid">
                        {courses.filter(course => selectedProf === 'all' || course.author === selectedProf)
                                .filter(course => selectedLvl === 'all-lvls' || course.level === selectedLvl)
                                .map(course => (
                                    <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;