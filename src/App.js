import {HashRouter, Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import CoursePage from './pages/CoursePage/CoursePage';
import ChapterPage from './pages/ChapterPage/ChapterPage';
import UsefulLinks from './pages/UsefulLinks/UsefulLinks';
import Header from './components/Header/Header';
import './App.css';

function App() {
    return (
        <HashRouter>
            <div className="app">
                <Header/>
                <div className="main-content">
                    <div className="content-area">
                        <Routes>
                            <Route path="/course/:courseId/chapter/:chapterId" element={<ChapterPage/>}/>
                            <Route path="/course/:courseId" element={<CoursePage/>}/>
                            <Route path="/useful_links" element={<UsefulLinks/>}/>
                            <Route path="/kholyavin" element={<HomePage author="kholyavin"/>}/>
                            <Route path="/tityushina" element={<HomePage author="tityushina"/>}/>
                            <Route path="/" element={<HomePage author="all"/>}/>
                        </Routes>
                    </div>
                </div>
            </div>
        </HashRouter>
    );
}

export default App;