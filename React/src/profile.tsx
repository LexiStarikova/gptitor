import { useState, useEffect } from 'react';
import './profile.css';
import { log } from 'console';
import { Chart } from 'chart.js/auto';

const Profile: React.FC = () => {
    const [statistics, setStatistics] = useState({
        daily_activity: [{date: '0', number_of_queries: 0}],
        metrics: { criterion_1: 0, criterion_2: 0, criterion_3: 0, criterion_4: 0 },
        total_activity: { total_queries: 0, total_conversations: 0, tasks_solved: 0 },
        average_grade: 0
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    let score = 0;

    const fetchStatistics = async () => {
        try {
            const response = await fetch('http://10.100.30.244:8005/profile/statistics', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
            const data = await response.json();
            setStatistics({
                daily_activity: await data.daily_activity,
                metrics: await data.metrics,
                total_activity: await data.total_activity,
                average_grade: await calculateAverageGrade(data)
            });
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, []);

    const calculateAverageGrade = async (data: any) => {
        return await (data.metrics.criterion_1
            + data.metrics.criterion_2
            + data.metrics.criterion_3
            + data.metrics.criterion_4)/4
    };

    const animateProgressBar = async (grade: number) => {
        const progressbar = await document.querySelector('.progressbar-rounded-base-circle') as HTMLElement;
        
        console.log(grade)
        progressbar.style.setProperty('--calculated-value', `${(grade/5*100).toFixed(1)}`);
        progressbar.style.animation = "progress 1.5s forwards";
    }

    const loadProgressChart = async () => {
        const ctx = document.getElementById('progressChart') as HTMLCanvasElement;

        const dates = statistics.daily_activity.map(activity => activity.date.split('-'));
        const activity = statistics.daily_activity.map(activity => activity.number_of_queries);
        const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                  labels: dates.map(date => `${date[1]}-${date[2]}`),
                  datasets: [{
                    label: '# of Queries',
                    data: activity,
                    borderWidth: 1,
                    borderColor: '#0060AE',
                    backgroundColor: '#0060AE',
                  }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                }
              });
    }

    useEffect(() => {
        if (!isLoading) {
            console.log(statistics);
            animateProgressBar(statistics.average_grade);
            loadProgressChart()
        }
    }, [isLoading]);

    return (
        <div>
            <div className='profilepage'>
                <div className='Part1'>
                    <div className="profilecontainer">
                        <div className="profileimg"></div>
                        <div className="infobox">
                            <div className='infocontent'>
                                <div className="name">
                                    <div className='id'>
                                        <h4>Irina</h4>
                                        <div className="tooltip-container">
                                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className='idicon'>
                                                <path d="M27.0866 20.5922C27.6896 19.1363 28 17.5759 28 16C28 12.8174 26.7357 9.76516 24.4853 7.51472C22.2348 5.26428 19.1826 4 16 4C12.8174 4 9.76515 5.26428 7.51472 7.51472C5.26428 9.76516 4 12.8174 4 16C4 17.5759 4.31039 19.1363 4.91345 20.5922C5.5165 22.0481 6.40042 23.371 7.51472 24.4853C8.62902 25.5996 9.95189 26.4835 11.4078 27.0866C12.8637 27.6896 14.4241 28 16 28C17.5759 28 19.1363 27.6896 20.5922 27.0866C22.0481 26.4835 23.371 25.5996 24.4853 24.4853C25.5996 23.371 26.4835 22.0481 27.0866 20.5922Z" fill="#12152A" />
                                                <path d="M16 9L16 19M16 22.5L16 23" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                                            </svg>
                                            <p className="tooltip">#42069</p>
                                        </div>
                                    </div>
                                    <h4 className='surname'>Khabalovna</h4>
                                </div>
                                <div className='contact'>
                                    <div className='email'>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.20039 6.60005L11.3173 11.5272C11.7283 11.8117 12.2725 11.8117 12.6834 11.5272L19.8004 6.60005M4.80039 19.2H19.2004C20.5259 19.2 21.6004 18.1255 21.6004 16.8V7.20005C21.6004 5.87457 20.5259 4.80005 19.2004 4.80005H4.80039C3.47491 4.80005 2.40039 5.87457 2.40039 7.20005V16.8C2.40039 18.1255 3.47491 19.2 4.80039 19.2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                        <p>i.khabalovna@innopolis.university</p>
                                    </div>
                                    <p className='role'>Student</p>
                                </div>
                            </div>
                        </div>
                        <div className='progress'>
                            <h2 className='Ptitle'>Progress:</h2>
                            <div className='avgactivity'>
                            <div>
                                <canvas id="progressChart"></canvas>
                            </div>
                                <div className='progressbar-rounded'>
                                    <div className='progressbar-rounded-base-circle'>
                                        <h6 className='progressbar-rounded-text'>Average Grade</h6>
                                        <h3 className='progressbar-rounded-score'>{statistics.average_grade.toFixed(1)}/5</h3>
                                    </div>
                                </div>
                            </div>
                            <div className='stats'>
                                <div className='box'>
                                    <div className='staticon'>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.20039 8.7999H4.80039C3.47491 8.7999 2.40039 9.87442 2.40039 11.1999C2.40039 12.5254 2.40039 17.8744 2.40039 19.1999C2.40039 20.5254 3.47491 21.5999 4.80039 21.5999C4.80039 21.5999 11.4749 21.5999 12.8004 21.5999C14.1259 21.5999 15.2004 20.5254 15.2004 19.1999V16.1999M19.2004 2.3999L11.2004 2.3999C9.87491 2.3999 8.80039 3.47442 8.80039 4.7999C8.80039 6.12539 8.80039 11.4744 8.80039 12.7999C8.80039 14.1254 9.87491 15.1999 11.2004 15.1999C11.2004 15.1999 17.8749 15.1999 19.2004 15.1999C20.5259 15.1999 21.6004 14.1254 21.6004 12.7999V4.7999C21.6004 3.47442 20.5259 2.3999 19.2004 2.3999Z" stroke="#3B4168" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                    <div className='statdesc'>

                                        <h4 className='statnumber'>{statistics.total_activity.total_queries}</h4>
                                        <p className='stattype'>Total Queries</p>
                                        <p className='stattoday'>+0</p>
                                    </div>

                                </div>
                                <div className='box'>
                                    <div className='staticon'>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.39941 8.3999H15.5994M8.39941 13.1999H12.5994M21.5994 11.9999C21.5994 13.3799 21.3082 14.6919 20.7839 15.8779L21.6012 21.599L16.6983 20.3733C15.3094 21.1544 13.7064 21.5999 11.9994 21.5999C6.69748 21.5999 2.39941 17.3018 2.39941 11.9999C2.39941 6.69797 6.69748 2.3999 11.9994 2.3999C17.3013 2.3999 21.5994 6.69797 21.5994 11.9999Z" stroke="#3B4168" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                    <div className='statdesc'>
                                        <h4 className='statnumber'>{statistics.total_activity.total_conversations}</h4>
                                        <p className='stattype'>Total Conversations</p>
                                        <p className='stattoday'>+0</p>
                                    </div>

                                </div>
                                <div className='box'>
                                    <div className='staticon'>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.2996 21.6001H5.4996C4.17411 21.6001 3.0996 20.5256 3.09961 19.2001L3.0997 4.80013C3.09971 3.47466 4.17422 2.40015 5.4997 2.40015H16.3C17.6255 2.40015 18.7 3.47466 18.7 4.80015V11.4001M13.9 18.2001L16.1 20.4001L20.9 15.6M7.29998 7.20015H14.5M7.29998 10.8001H14.5M7.29998 14.4001H10.9" stroke="#3B4168" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                    <div className='statdesc'>
                                        <h4 className='statnumber'>{statistics.total_activity.tasks_solved}</h4>
                                        <p className='stattype'>Tasks Solved</p>
                                        <p className='stattoday'>+0</p>
                                    </div>
                                </div>
                            </div>
                            <div className='btn'>
                                <button className='resetbtn'>RESET</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='Part2'>
                    <div className='criteriaBox'>
                        <div className='infoiconcrit crittooltip-container'>
                            <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.4144 18.4877L18.4144 25.8047M18.4144 13.0642V12.9999M3.78027 18.4877C3.78027 10.4054 10.3322 3.85351 18.4144 3.85352C26.4966 3.85352 33.0486 10.4054 33.0486 18.4877C33.0486 26.5699 26.4966 33.1218 18.4144 33.1218C10.3322 33.1218 3.78027 26.5699 3.78027 18.4877Z" stroke="#12152A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <p className='crittooltip'>Ah Yes, Criteria Description.</p>
                        </div>
                        <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg" className='criteriaicon'>
                            <rect y="0.975586" width="40" height="40" rx="20" fill="#2287DA" />
                            <path d="M20 23.6006C19.385 23.6006 18.875 23.0906 18.875 22.4756V14.9756C18.875 14.3606 19.385 13.8506 20 13.8506C20.615 13.8506 21.125 14.3606 21.125 14.9756V22.4756C21.125 23.0906 20.615 23.6006 20 23.6006Z" fill="white" />
                            <path d="M20 28.4757C19.805 28.4757 19.61 28.4307 19.43 28.3557C19.25 28.2807 19.085 28.1757 18.935 28.0407C18.8 27.8907 18.695 27.7407 18.62 27.5457C18.545 27.3657 18.5 27.1707 18.5 26.9757C18.5 26.7807 18.545 26.5857 18.62 26.4057C18.695 26.2257 18.8 26.0607 18.935 25.9107C19.085 25.7757 19.25 25.6707 19.43 25.5957C19.79 25.4457 20.21 25.4457 20.57 25.5957C20.75 25.6707 20.915 25.7757 21.065 25.9107C21.2 26.0607 21.305 26.2257 21.38 26.4057C21.455 26.5857 21.5 26.7807 21.5 26.9757C21.5 27.1707 21.455 27.3657 21.38 27.5457C21.305 27.7407 21.2 27.8907 21.065 28.0407C20.915 28.1757 20.75 28.2807 20.57 28.3557C20.39 28.4307 20.195 28.4757 20 28.4757Z" fill="white" />
                        </svg>
                        <div className='bar'>
                            <div className='critdesc'>
                                <h5>{statistics.metrics.criterion_1}/5</h5>
                                <h6>Conciseness & Focus</h6>
                            </div>
                            <div className='progbar'>
                                <div className='progressbar-internals' style={{ width: `${(statistics.metrics.criterion_1/5*100)}%`, backgroundColor: '#0060AE', height: '100%', borderRadius: '64px' }}></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='criteriaBox'>
                            <div className='infoiconcrit crittooltip-container'>
                                <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.4144 18.4877L18.4144 25.8047M18.4144 13.0642V12.9999M3.78027 18.4877C3.78027 10.4054 10.3322 3.85351 18.4144 3.85352C26.4966 3.85352 33.0486 10.4054 33.0486 18.4877C33.0486 26.5699 26.4966 33.1218 18.4144 33.1218C10.3322 33.1218 3.78027 26.5699 3.78027 18.4877Z" stroke="#12152A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <p className='crittooltip'>Ah Yes, Criteria Description.</p>
                            </div>
                            <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg" className='criteriaicon'>
                                <rect x="1" y="1.71948" width="38" height="38" rx="19" fill="white" />
                                <rect x="1" y="1.71948" width="38" height="38" rx="19" stroke="#2287DA" stroke-width="2" />
                                <circle cx="20" cy="20.7195" r="4.5" fill="#2287DA" />
                            </svg>

                            <div className='bar'>
                                <div className='critdesc'>
                                    <h5>{statistics.metrics.criterion_2}/5</h5>
                                    <h6>Clarity & Specificity</h6>
                                </div>
                                <div className='progbar'>
                                    <div className='progressbar-internals' style={{ width: `${(statistics.metrics.criterion_2/5*100)}%`, backgroundColor: '#0060AE', height: '100%', borderRadius: '64px' }}></div>
                                </div>
                            </div>
                            <div className='details'>
                                <p className='p2'>More Detais &lt;</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='criteriaBox'>
                            <div className='infoiconcrit crittooltip-container'>
                                <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.4144 18.4877L18.4144 25.8047M18.4144 13.0642V12.9999M3.78027 18.4877C3.78027 10.4054 10.3322 3.85351 18.4144 3.85352C26.4966 3.85352 33.0486 10.4054 33.0486 18.4877C33.0486 26.5699 26.4966 33.1218 18.4144 33.1218C10.3322 33.1218 3.78027 26.5699 3.78027 18.4877Z" stroke="#12152A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <p className='crittooltip'>Ah Yes, Criteria Description.</p>
                            </div>
                            <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg" className='criteriaicon'>
                                <rect y="0.804932" width="40" height="40" rx="20" fill="#2287DA" />
                                <path d="M15.755 26.175C15.47 26.175 15.185 26.07 14.96 25.845C14.525 25.41 14.525 24.69 14.96 24.255L23.45 15.765C23.885 15.33 24.605 15.33 25.04 15.765C25.475 16.2 25.475 16.92 25.04 17.355L16.55 25.845C16.34 26.07 16.04 26.175 15.755 26.175Z" fill="white" />
                                <path d="M24.245 26.175C23.96 26.175 23.675 26.07 23.45 25.845L14.96 17.355C14.525 16.92 14.525 16.2 14.96 15.765C15.395 15.33 16.115 15.33 16.55 15.765L25.04 24.255C25.475 24.69 25.475 25.41 25.04 25.845C24.815 26.07 24.53 26.175 24.245 26.175Z" fill="white" />
                            </svg>

                            <div className='bar'>
                                <div className='critdesc'>
                                    <h5>{statistics.metrics.criterion_3}/5</h5>
                                    <h6>Relevance & Context</h6>
                                </div>
                                <div className='progbar'>
                                    <div className='progressbar-internals' style={{ width: `${(statistics.metrics.criterion_3/5*100)}%`, backgroundColor: '#0060AE', height: '100%', borderRadius: '64px' }}></div>
                                </div>
                            </div>
                            <div className='details'>
                                <p className='p2'>More Detais &lt;</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='criteriaBox'>
                            <div className='infoiconcrit crittooltip-container'>
                                <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.4144 18.4877L18.4144 25.8047M18.4144 13.0642V12.9999M3.78027 18.4877C3.78027 10.4054 10.3322 3.85351 18.4144 3.85352C26.4966 3.85352 33.0486 10.4054 33.0486 18.4877C33.0486 26.5699 26.4966 33.1218 18.4144 33.1218C10.3322 33.1218 3.78027 26.5699 3.78027 18.4877Z" stroke="#12152A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <p className='crittooltip'>Ah Yes, Criteria Description.</p>
                            </div>
                            <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg" className='criteriaicon'>
                                <rect y="0.890137" width="40" height="40" rx="20" fill="#2287DA" />
                                <path d="M17.8702 26.26C17.5702 26.26 17.2852 26.14 17.0752 25.93L12.8302 21.685C12.3952 21.25 12.3952 20.53 12.8302 20.095C13.2652 19.66 13.9852 19.66 14.4202 20.095L17.8702 23.545L25.5802 15.835C26.0152 15.4 26.7352 15.4 27.1702 15.835C27.6052 16.27 27.6052 16.99 27.1702 17.425L18.6652 25.93C18.4552 26.14 18.1702 26.26 17.8702 26.26Z" fill="white" />
                            </svg>

                            <div className='bar'>
                                <div className='critdesc'>
                                    <h5>{statistics.metrics.criterion_4}/5</h5>
                                    <h6>Purpose & Output</h6>
                                </div>
                                <div className='progbar'>
                                    <div className='progressbar-internals' style={{ width: `${(statistics.metrics.criterion_4/5*100)}%`, backgroundColor: '#0060AE', height: '100%', borderRadius: '64px' }}></div>
                                </div>
                            </div>
                            <div className='details'>
                                <p className='p2'>More Detais &lt;</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
