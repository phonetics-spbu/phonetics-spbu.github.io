import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import CoursePage from './pages/CoursePage/CoursePage';
import ChapterPage from './pages/ChapterPage/ChapterPage';
import Header from './components/Header/Header';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app">
                <Header/>
                <div className="main-content">
                    <div className="content-area">
                        <Routes>
                            <Route path="/course/:courseId/chapter/:chapterId" element={<ChapterPage/>}/>
                            <Route path="/course/:courseId" element={<CoursePage/>}/>
                            <Route path="/" element={<HomePage/>}/>
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;