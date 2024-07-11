import { useState, useEffect, useRef, MouseEvent, SetStateAction, Dispatch } from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';
import QueryComponent from './queryComponent';

interface MessageSimplifyed {
    id: number,
    text: string
}

interface SidebarProps {
    CreateConversation: () => void;
    openConversation: (stored_id: number) => void;
    deleteConversation: (display_id: number, stored_id: number) => void;
    requests: MessageSimplifyed[];
    responses: MessageSimplifyed[];
    queries: { display_id: number; stored_id: number; text: string }[]
}


const Sidebar: React.FC<SidebarProps> = ({
    CreateConversation,
    openConversation,
    deleteConversation,
    requests,
    responses,
    queries
}) => {
    const [selectedQueryId, setSelectedQueryId] = useState<number | null>(null);
    const handleQuerySelection = (stored_id: number) => {
        setSelectedQueryId(stored_id);
    };

    const [sidebarVisible, setSidebarVisible] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const toggleSidebar = () => {
        setSidebarVisible(prev => !prev);
    };

    useEffect(() => {
        if (queries.length > 0) {
            setSelectedQueryId(queries[queries.length - 1].stored_id);
            openConversation(queries[queries.length - 1].stored_id);
        }
    }, [queries]);

    const handleCreateConversation = () => {
        CreateConversation();
    };

    const handleMouseLeave = () => {
        setSidebarVisible(false);
    };


    return (
        <div>
            <div className={`sidebar${sidebarVisible ? '' : 'hd'} sidebarshown`} onMouseLeave={handleMouseLeave}>
                <div className='sideindex'>
                    <div className='sidetitle'>
                        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className='menuiconhidden' onClick={toggleSidebar}>
                            <path d="M23.3996 20.8H2.59961M23.3996 13H2.59961M23.3996 5.19995H2.59961" stroke="#3B4168" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        <Link className='gpttitle' to="/chatpage"><h4 >GPTитор</h4></Link>
                        <Link className='gpttitle' to="/chatpage">
                            <svg
                                width="26"
                                height="26"
                                viewBox="0 0 26 26"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className='chaticonhidden'
                                onClick={handleCreateConversation}
                            >
                                <path d="M12.9996 13.0001V10.4001M12.9996 10.4001V7.8001M12.9996 10.4001H10.3996M12.9996 10.4001H15.5996M12.6605 17.974L7.23439 23.4001V17.974H5.19961C3.76367 17.974 2.59961 16.8099 2.59961 15.374V5.2001C2.59961 3.76416 3.76367 2.6001 5.19961 2.6001H20.7996C22.2355 2.6001 23.3996 3.76416 23.3996 5.2001V15.374C23.3996 16.8099 22.2355 17.974 20.7996 17.974H12.6605Z" stroke="#3B4168" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </div>

                    <div className='middle'>
                        <div className='historysearch'>
                            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg" className='searchicon'>
                                <path d="M14.1057 15.077L17 17.877M9.5 6.87695C11.1569 6.87695 12.5 8.2201 12.5 9.87695M16.0667 10.4103C16.0667 14.0185 13.1416 16.9436 9.53333 16.9436C5.92507 16.9436 3 14.0185 3 10.4103C3 6.80203 5.92507 3.87695 9.53333 3.87695C13.1416 3.87695 16.0667 6.80203 16.0667 10.4103Z" stroke="#3B4168" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <input type="text" placeholder='History' className='historyinpt' />
                        </div>
                        <div className='fav'>
                            <div className='latest'>
                                <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.5169 13.5748L10.9169 12.3736V7.35094M20.5169 11.1724C20.5169 5.86528 16.2188 1.56299 10.9169 1.56299C5.61496 1.56299 1.31689 5.86528 1.31689 11.1724C1.31689 16.4796 5.61496 20.7819 10.9169 20.7819C14.4702 20.7819 17.5727 18.8494 19.2326 15.9772M17.8834 10.1179L20.2833 12.5203L22.6833 10.1179" stroke="#3B4168" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p>Latest</p>
                            </div>
                            <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg" className='favicon'>
                                <path d="M21.33 11.8242H8.67004M16.875 14.6395C15.319 14.6395 13.125 14.6395 13.125 14.6395M21.375 12.2008V19.8008C21.375 20.6818 20.6615 21.3961 19.7812 21.3961H10.2188C9.33855 21.3961 8.625 20.6818 8.625 19.8008V12.2008C8.625 11.9531 8.68261 11.7089 8.79326 11.4873L9.88837 9.29495C10.0909 8.8896 10.5047 8.63354 10.9575 8.63354H19.0425C19.4953 8.63354 19.9091 8.8896 20.1116 9.29495L21.2067 11.4873C21.3174 11.7089 21.375 11.9531 21.375 12.2008Z" stroke="#3B4168" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className='querylist'>
                            <div className='history'>
                                <p className='Date'>TODAY</p>
                            </div>
                            <div className='queries'>
                                {queries.map(query => (
                                    <QueryComponent key={query.display_id} display_id={query.display_id} stored_id={query.stored_id} queryText={query.text} onDelete={deleteConversation} onOpen={openConversation} isSelected={selectedQueryId === query.stored_id}
                                        handleSelection={() => handleQuerySelection(query.stored_id)} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="icons-nothidden">
                        <Link to="/profile" className='prof'>
                            <div className='profile'>
                                <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" className='profileiconhidden'>
                                    <path d="M6.52539 23.1999C7.08264 22.5758 9.69249 19.7038 10.4573 19.7038H18.544C19.6523 19.7038 21.9147 22.0845 22.4754 22.9237M26.1004 14.4999C26.1004 20.9064 20.9069 26.0999 14.5004 26.0999C8.09389 26.0999 2.90039 20.9064 2.90039 14.4999C2.90039 8.0934 8.09389 2.8999 14.5004 2.8999C20.9069 2.8999 26.1004 8.0934 26.1004 14.4999ZM18.6557 10.5462C18.6557 8.33311 16.7874 6.5249 14.5007 6.5249C12.2141 6.5249 10.3458 8.33311 10.3458 10.5462C10.3458 12.7593 12.2141 14.5675 14.5007 14.5675C16.7874 14.5675 18.6557 12.7593 18.6557 10.5462Z" stroke="#3B4168" strokeWidth="2" />
                                </svg>

                                <p>Profile</p>
                            </div>
                        </Link>
                        <div className='info'>
                            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className='infoiconhidden'>
                                <path d="M12.9996 13.0001L12.9996 18.2001M12.9996 9.1458V9.1001M2.59961 13.0001C2.59961 7.25633 7.25585 2.6001 12.9996 2.6001C18.7434 2.6001 23.3996 7.25634 23.3996 13.0001C23.3996 18.7439 18.7434 23.4001 12.9996 23.4001C7.25585 23.4001 2.59961 18.7439 2.59961 13.0001Z" stroke="#3B4168" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p>Help</p>
                        </div>
                    </div>
                    <svg className='gradient-mn' width="305" height="305" viewBox="0 0 305 305" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.499973 -1.33101e-05C40.4875 -1.5058e-05 80.0834 7.87608 117.027 23.1787C153.971 38.4812 187.539 60.9105 215.814 89.186C244.089 117.461 266.519 151.029 281.821 187.973C297.124 224.917 305 264.512 305 304.5L0.499987 304.5L0.499973 -1.33101e-05Z" fill="url(#paint0_radial_916_1156)" />
                        <defs>
                            <radialGradient id="paint0_radial_916_1156" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0.861193 297.276) rotate(-149.546) scale(310.416)">
                                <stop stop-color="#AAABFA" />
                                <stop offset="0.916" stop-color="white" />
                                <stop offset="1" stop-color="white" />
                            </radialGradient>
                        </defs>
                    </svg>
                </div>
            </div>


            <div className={`sidebarhidden${sidebarVisible ? 'hd' : ''}`} >
                <div className='iconshidden'>
                    <svg onClick={toggleSidebar} width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className='menuiconhidden'>
                        <path d="M23.3996 20.8H2.59961M23.3996 13H2.59961M23.3996 5.19995H2.59961" stroke="#3B4168" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <Link className='gpttitle' to="/chatpage">
                        <svg
                            width="26"
                            height="26"
                            viewBox="0 0 26 26"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className='chaticonhidden'
                            onClick={CreateConversation}
                        >
                            <path d="M12.9996 13.0001V10.4001M12.9996 10.4001V7.8001M12.9996 10.4001H10.3996M12.9996 10.4001H15.5996M12.6605 17.974L7.23439 23.4001V17.974H5.19961C3.76367 17.974 2.59961 16.8099 2.59961 15.374V5.2001C2.59961 3.76416 3.76367 2.6001 5.19961 2.6001H20.7996C22.2355 2.6001 23.3996 3.76416 23.3996 5.2001V15.374C23.3996 16.8099 22.2355 17.974 20.7996 17.974H12.6605Z" stroke="#3B4168" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>
                <div className="icons-hidden-bottom">
                    <Link to="/profile">
                        <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" className='profileiconhidden'>
                            <path d="M6.52539 23.1999C7.08264 22.5758 9.69249 19.7038 10.4573 19.7038H18.544C19.6523 19.7038 21.9147 22.0845 22.4754 22.9237M26.1004 14.4999C26.1004 20.9064 20.9069 26.0999 14.5004 26.0999C8.09389 26.0999 2.90039 20.9064 2.90039 14.4999C2.90039 8.0934 8.09389 2.8999 14.5004 2.8999C20.9069 2.8999 26.1004 8.0934 26.1004 14.4999ZM18.6557 10.5462C18.6557 8.33311 16.7874 6.5249 14.5007 6.5249C12.2141 6.5249 10.3458 8.33311 10.3458 10.5462C10.3458 12.7593 12.2141 14.5675 14.5007 14.5675C16.7874 14.5675 18.6557 12.7593 18.6557 10.5462Z" stroke="#3B4168" strokeWidth="2" />
                        </svg>
                    </Link>
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className='infoiconhidden'>
                        <path d="M12.9996 13.0001L12.9996 18.2001M12.9996 9.1458V9.1001M2.59961 13.0001C2.59961 7.25633 7.25585 2.6001 12.9996 2.6001C18.7434 2.6001 23.3996 7.25634 23.3996 13.0001C23.3996 18.7439 18.7434 23.4001 12.9996 23.4001C7.25585 23.4001 2.59961 18.7439 2.59961 13.0001Z" stroke="#3B4168" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>


                </div>
                <svg className='gradient' width="54" height="48" viewBox="0 0 54 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M-7.47368 0C0.474747 0 8.34534 1.29329 15.6887 3.80602C23.0321 6.31876 29.7045 10.0017 35.3249 14.6447C40.9453 19.2876 45.4036 24.7996 48.4453 30.8658C51.4871 36.9321 53.0526 43.4339 53.0526 50L-7.47368 50V0Z" fill="url(#paint0_radial_904_1170)" />
                    <defs>
                        <radialGradient id="paint0_radial_904_1170" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-7.40188 48.8138) rotate(-154.094) scale(59.1317 53.1871)">
                            <stop stop-color="#AAABFA" />
                            <stop offset="0.916" stop-color="white" />
                            <stop offset="1" stop-color="white" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>

        </div >
    );
};


export default Sidebar;
