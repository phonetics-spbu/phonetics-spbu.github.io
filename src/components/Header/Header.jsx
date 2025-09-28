import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="header-container">
                <div>
                    <div className="header_uni">Санкт-Петербургский государственный университет</div>
                    <div className="header_chair">Кафедра фонетики и методики преподавания иностранных языков</div>
                    <div className="header-title">Учебные курсы</div>
                </div>
            </div>
            <div className="header_img_div">
                <img alt="" className="header_img" src={process.env.PUBLIC_URL + "/img/anteater.jpg"}></img>
                <div className="header_authors">© Кафедра фонетики СПбГУ & Титюшина Анна & Холявин Павел, 2025</div>
            </div>
        </header>
    );
}

export default Header;