import "./header.css"
// import  Book from "node_modules/UI-kit UNIONE/vuesax/bulk/book.svg";

const Header = () => {
    return (
        <header id="header">
                <div id="logo">
                    <img src="src/UI-kit UNIONE/Icons/Header/ЕМОП_лого 1.svg"></img>
                </div>
                <div id="tabs">
                <nav id="header_nav">
                    <ul>
                        <li id="Портал">
                            <img  id="book" src="src/UI-kit UNIONE/Icons/Header/book.svg" ></img>
                            <a id="Портал-text" href="#">Портал</a>
                        </li>
                        <li id="Ассесмент">
                            <img id="Checked-box" src="src/UI-kit UNIONE/Icons/Header/Checked-box.svg" ></img>
                            <a id="Ассесмент-text" href="#">Ассесмент</a>
                        </li>
                        <li id="Курсы">
                            <img id="Work" src="src/UI-kit UNIONE/Icons/Header/Work.svg" ></img>
                            <a id="Курсы-text" href="#">Курсы</a>
                        </li>
                        <li id="программы">
                            <img id="note-2" src="src/UI-kit UNIONE/Icons/Header/note-2.svg" ></img>
                            <a id="программы-text" href="#">Обр. программы</a>
                        </li>
                        <li id="Каталог">
                            <img id="box" src="src/UI-kit UNIONE/Icons/Header/box.svg" ></img>
                            <a id="Каталог-text" href="#">Каталог ПО</a>
                        </li>
                        <li id="Аналитика">
                            <img id="chart" src="src/UI-kit UNIONE/Icons/Header/chart.svg" ></img>
                            <a id="Аналитика-text" href="#">Аналитика</a>
                        </li>
                        <li id="Робокод">
                            <img id="teacher" src="src/UI-kit UNIONE/Icons/Header/teacher.svg" ></img>
                            <a id="Робокод-text" href="#">Робокод</a>
                        </li>
                        <li id="Клуб">
                            <img id="people" src="src/UI-kit UNIONE/Icons/Header/people.svg" ></img>
                            <a id="Клуб-text" href="#">Клуб</a>
                        </li>
                    </ul>
                </nav>
                </div>
                <div id="login">
                    <div id="notifications">

                    </div>
                    <div id="profile">
                        <ul>
                            <li>
                                <img id="icon-messages" src ="src/UI-kit UNIONE/Icons/Header/messages.svg"></img>
                            </li>
                            <li id="profile-button">
                                <img id="picture" src="src/UI-kit UNIONE/Icons/Header/avatar.png">
                                </img>
                            </li>
                        </ul>
                    </div>
                </div>
            
        </header>
    );
};
export default Header;
