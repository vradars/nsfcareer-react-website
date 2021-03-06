    import React from 'react';
    import RostarBtn from './Buttons/RostarBtn';
    import { Redirect, Link, withRouter } from 'react-router-dom'

    import Footer from './Footer';
    import PenstateUniversity from './PenstateUniversity';
    import { getStatusOfDarkmode } from '../reducer';
    import DarkMode from './DarkMode';
    import SideBar from './SideBar';
    import { connect } from 'react-redux';
    import { UncontrolledAlert } from 'reactstrap';
    import {
        uploadSensorDataAndCompute,
        getTeamAdminData,
        getImpactHistory,
        getImpactSummary,
        getPlayersData,
        getSimulationStatusCount
    } from '../apis';



    import { FilePond } from 'react-filepond';
    import 'filepond/dist/filepond.min.css';

    import socketIOClient from 'socket.io-client'


    import { Bar } from 'react-chartjs-2';
    import Spinner from './Spinner/Spinner';

    const impactHistoryBarData = {
        labels: [],
        datasets: [
            {
                label: 'Impact History',
                backgroundColor: '#0E7DD6',
                borderColor: '#084474',
                hoverBackgroundColor: '#0B5FA2',
                hoverBorderColor: '#0B5FA2',
                data: []
            }
        ]
    };

    const impactSummaryBarData = {
        labels: [],
        datasets: [
            {
                label: 'Impact Summary',
                backgroundColor: '#0E7DD6',
                borderColor: '#084474',
                hoverBackgroundColor: '#0B5FA2',
                hoverBorderColor: '#0B5FA2',
                data: []
            }
        ]
    };

    class CommanderTeamView extends React.Component {
        constructor(props) {
            super(props);
            console.log("IN TEAM VIEW ",this.props.location)
            this.state = {
                avgLoad: 0.02,
                alerts: 0,
                team: 2,
                athletes: 6,
                staff: 8,
                highestLoadCount: 0.046,
                impactCount: 3,
                tabActive: 0,
                targetBtn: '',
                rosterValue: 'Lorem ipsum',
                visibilityRosterValueSelector: { display: 'none' },
                selectedFile: null,
                isLoading: true,
                isUploading: false,
                isFileUploaded: false,
                fileUploadError: '',
                isLoaded: false,
                impactSummaryData: {},
                impactHistoryData: {},
                uploadMessageLog : '',
                users : [],
                redirectData : {},
                cognito_user_id : '',
                player_name : '',
                buttonSelected : 'overview',
                simulations_completed : 0,
                simulations_pending : 0,
                simulation_failed : 0
            };
        }
        activateTab = (value) =>{
            if(value !== this.state.buttonSelected){
                this.setState({
                    buttonSelected : value
                })
            }
        }

        onChangeHandler = (event) => {
            event.persist();
            console.log(event.target.files[0]);
            this.setState({
                selectedFile: event.target.files[0]
            });
            this.onClickHandler(event.target.files[0])
        };

        onClickHandler = (selected_file) => {
            const data = new FormData();
            this.setState({
                isUploading: true,
                isFileUploaded: false,
                fileUploadError: ''
            });
            data.append('sensor_csv_file', selected_file);
            console.log(data);
            this.setState({
                uploadMessageLog : ''
            });

            uploadSensorDataAndCompute(data)
            .then((response) => {
                if(response.data.message === "success"){
                    getPlayersData({
                        organization : this.props.location.state.team.organization,
                        team_name : this.props.location.state.team.team_name
                    })
                    .then(response => {

                        this.setState({users : []});

                        for(var i = 0 ; i < response.data.data.length ; i++){
                            this.setState(prevState => ({
                                users: [...prevState.users, response.data.data[i]]
                            }));
                        }
                        this.setState({  });
                        getSimulationStatusCount({team : this.props.location.state.team.team_name })
                        .then(response => {
                            this.setState({
                                simulations_completed : response.data.data.completed,
                                simulation_failed : response.data.data.failed,
                                simulations_pending : response.data.data.pending,
                                isUploading: false,
                                isFileUploaded: true,
                                uploadMessageLog : ''
                            });
                        })
                        .catch(err => {
                            this.setState({ isUploading: false, fileUploadError : response.data.error ,uploadMessageLog : ''});
                        })
                    })
                    .catch(err => {
                        this.setState({ isUploading: false, fileUploadError : response.data.error ,uploadMessageLog : ''});
                    })


                }
                else{
                    this.setState({ isUploading: false, fileUploadError : response.data.error ,uploadMessageLog : ''});

                }
                // reload function here

                console.log(response);
            })
            .catch(err => {
                this.setState({ isUploading: false, fileUploadError : err ,uploadMessageLog : ''});
                console.log(err);
            })
        };

        toggleTab = (value) => {
            this.setState({ tabActive: value });
        };

        getTargetBtn = (value) => {
            this.setState({ targetBtn: value });
        };

        setRedirectData = (id, p_name) => {
            this.setState({
                cognito_user_id : id,
                player_name : p_name
            })
        }

        setRosterValue = (e) => {
            this.setState({
                rosterValue: e.currentTarget.dataset.item
            });
        };

        makeVisibleSelector = () => {
            if (this.state.visibilityRosterValueSelector.display === 'none')
            this.setState({ visibilityRosterValueSelector: { display: 'block' } });
            else this.setState({ visibilityRosterValueSelector: { display: 'none' } });
        };
        componentWillUnmount() {
            const socket = socketIOClient();
            socket.off('fileUploadLog');
        }
        componentDidMount() {
            // Scrolling winddow to top when user clicks on about us page
            window.scrollTo(0, 0)

            // Socket
            const socket = socketIOClient();
            socket.on("fileUploadLog", data => {this.setState({
                uploadMessageLog : data
            })
        });

        getImpactHistory(JSON.stringify({}))
        .then((impactHistory) => {
            console.log('History', impactHistory);
            this.setState({
                impactHistoryData: {
                    ...this.state.impactHistoryData,
                    ...impactHistory.data.data
                }
            });
            return getImpactSummary(JSON.stringify({}));
        })
        .then((impactSummary) => {
            console.log('Summary', impactSummary);
            this.setState({
                impactSummaryData: {
                    ...this.state.impactSummaryData,
                    ...impactSummary.data.data
                }
            });

            return getPlayersData({
                organization : this.props.location.state.team.organization,
                team_name : this.props.location.state.team.team_name
            })

        })
        .then(response => {
            console.log(response);
            for(var i = 0 ; i < response.data.data.length ; i++){
                this.setState(prevState => ({
                    users: [...prevState.users, response.data.data[i]]
                }));
            }
            return getSimulationStatusCount({team : this.props.location.state.team.team_name })

        })
        .then(response => {

            this.setState({
                simulations_completed : response.data.data.completed,
                simulation_failed : response.data.data.failed,
                simulations_pending : response.data.data.pending
            });

            return getTeamAdminData(JSON.stringify({}));
        })
        .then((response) => {

            this.setState({
                adminData: { ...this.state.adminData, ...response.data.data },
                isLoaded: true
            });

            if (getStatusOfDarkmode().status === true) {
                this.refs.rosterContainer.style.background = '#171b25';
                for (let i = 1; i <= 7; i++) {
                    this.refs['card' + i].style.background = '#232838';
                    if ('card' + i === 'card5' || 'card' + i === 'card7') {
                        this.refs['card' + i].style.border = '1px solid #e8e8e8';
                    }
                }
            }
        })
        .catch((err) => {
            console.log(err);
        });

        if (getStatusOfDarkmode().status) {
            document.getElementsByTagName('body')[0].style.background = '#171b25';
        }
    }

    militaryVersionOrNormal = () => {
        return (
            <div
                ref="rosterContainer"
                className="container t-roster pt-5 mt-5 animated zoomIn"
                >
                <div className="row" >
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-12">
                                <p ref="h1" className="penstate">

                                        <Link style={{fontWeight : "400"}} to={'/OrganizationAdmin'} >Organization</Link>
                                         >
                                         {this.props.location.state.team.team_name}
                                </p>
                            </div>

                            <div className="col-md-12">
                                <div className="col-md-8 d-flex mt-3 justify-content-center align-items-center">
                                <div className="circle-badge counter-container ml-md-auto mr-md-auto text-center">
                                            <div
                                            style = {{
                                                background : "#c5e0b4",
                                                borderColor: "#a7de85"
                                            }}
                                            className="team-view-counter mb-2 ">
                                              <p
                                              style = {{
                                                  color : "#616060"
                                              }}
                                              >{this.state.simulations_completed}</p>
                                            </div>
                                            <p class="circle-sub-title" ref="h1">Simulations<br/>Complete</p>
                                </div>
                                <div className="circle-badge counter-container ml-md-auto mr-md-auto text-center">
                                <div
                                style = {{
                                    background : "#ffe699",
                                    borderColor: "#ffc107"
                                }}
                                className="team-view-counter mb-2 ">
                                  <p
                                  style = {{
                                      color : "#616060"
                                  }}
                                  >{this.state.simulations_pending}</p>
                                </div>
                                            <p class="circle-sub-title" ref="h1">Simulations<br/>Pending</p>
                                </div>
                                <div className="circle-badge counter-container ml-md-auto mr-md-auto text-center">
                                <div
                                style = {{
                                    background : "#f4b183",
                                    borderColor: "#ff954c"
                                }}
                                className="team-view-counter mb-2 ">
                                  <p
                                  style = {{
                                      color : "#616060"
                                  }}
                                  >{this.state.simulation_failed}</p>
                                </div>
                                            <p class="circle-sub-title" ref="h1">Simulations<br/>Failed</p>
                                </div>

                                </div>




                            </div>

                        </div>
                    </div>
                    <div className="col-md-4">
                        {/*<button style={{
                            width : "100%"
                            }} className="btn btn-primary"><i class="fa fa-arrow-circle-o-down" aria-hidden="true"></i> Upload Data</button>
                            */}
                            <div class="input-group mb-3 input-group-sm" style={{marginTop:"1rem"}}>

                                <div  class="input-group-prepend">
                                    <input
                                        onChange={this.onChangeHandler}
                                        type="file"
                                        name="sensor_csv_file"
                                        id="file"
                                        style={{
                                          display:"none",
                                          margin:"auto"
                                        }}
                                        />{' '}
                                        <label for="file" className = "upload-csv-file-button mt-1 mb-4" style={{
                                          textAlign : "center"
                                        }}>
                                        <i className="fa fa-cloud-upload"></i> UPLOAD DATA
                                        </label>

                                        </div>
                                    </div>



                                    {this.state.isUploading ? (
                                        <span><div className="d-flex justify-content-center center-spinner">
                                            <div
                                                className="spinner-border text-primary"
                                                role="status"
                                                ></div>
                                        </div>{this.state.uploadMessageLog}
                                    </span>
                                ) : null}
                                {this.state.isFileUploaded ? (
                                    <UncontrolledAlert
                                        color="success"
                                        style={{ marginTop: '5px' }}
                                        >
                                        Successfully uploaded the CSV/ XLSX file
                                    </UncontrolledAlert>
                                ) : null}
                                {this.state.fileUploadError ? (
                                    <UncontrolledAlert
                                        style={{ marginTop: '5px' }}
                                        color="danger"

                                        >
                                        Failed to upload CSV/ XLSX file

                                    </UncontrolledAlert>
                                ) : null}
                                <div style={{
                                        alignItems : "center",
                                        textAlign : "center",
                                        marginTop : "-2rem"
                                    }}>

                                    <br/>
                                    <span style={{fontSize : "1.2rem", weight : "900"}} className="top-heading__login" >Are you a sensor company ?</span> <br/>
                                    <span style={{fontSize : "1rem", weight : "400", color:"grey"}} className="top-heading__login" >
                                        Our API is available that can be readily incorporated into your own platform.
                                        <br/>
                                        <Link style={{fontSize : "1.2rem", weight : "900"}} className="top-heading__login" to={'/Developer'} >Read More Here</Link>
                                    </span>

                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 my-auto">

                        </div>
                        <div className="row text-center">
                            <div className="col-md-12">

                                <div className="row mt-3">



                                    </div>
                                    {/*
                                        <div className="row">
                                        <div
                                        ref="card1"
                                        className="col-md-12 commander-view-card mb-5 mt-4 p-0"
                                        >
                                        <div className="rostar-selector">
                                        <RostarBtn
                                        tabActive={this.toggleTab}
                                        makeActive={this.state.tabActive}
                                        getBtn={this.getTargetBtn}
                                        currentBtn={this.state.targetBtn}
                                        content="Overview"
                                        />
                                        <RostarBtn
                                        tabActive={this.toggleTab}
                                        makeActive={this.state.tabActive}
                                        getBtn={this.getTargetBtn}
                                        currentBtn={this.state.targetBtn}
                                        content="Roster"
                                        />
                                        </div>

                                        <div className="row mt-5">
                                        <div className="col-md-6">
                                        <div className="highest-load ml-3 mr-3 mt-3 mb-5">
                                        <div ref="card5" className="card">
                                        <div
                                        ref="card4"
                                        className="load-heading highest-load-height"
                                        >
                                        HIGHEST LOAD
                                        </div>
                                        <p className="mt-4 ">
                                        John Sylvester{' '}
                                        <span>- {this.state.adminData.organization} </span>
                                        </p>

                                        <div className="text-center">
                                        <div className="progress--circle progress--5">
                                        <div className="progress__number">0.046</div>
                                        </div>
                                        </div>

                                        <div className="load-count mt-3 mb-3">
                                        {this.state.adminData.highest_load}
                                        </div>
                                        </div>
                                        </div>
                                        </div>

                                        <div className="col-md-6">
                                        <div className="most-impacts ml-3 mr-3 mt-3 mb-5">
                                        <div ref="card7" className="card commander-tv-height">
                                        <div
                                        ref="card6"
                                        className="impact-heading most-impacts-height"
                                        >
                                        MOST IMPACTS
                                        </div>
                                        <p className="mt-4">
                                        John Sylvester{' '}
                                        <span>- {this.state.adminData.organization} </span>
                                        </p>
                                        <div className="impact-count mt-3 mb-3">
                                        {this.state.adminData.impacts}
                                        </div>
                                        </div>
                                        </div>
                                        </div>
                                        </div>

                                        </div>
                                        </div>
                                        */}
                                    </div>
                                    {/*
                                        <div className="col-md-4 pt-5 mb-3">
                                        <div className="row mt-2">
                                        <div className="col-md-12  text-left">
                                        <button type="btn" className="impact-sumary-btn">
                                        Impact Summary
                                        </button>
                                        </div>
                                        </div>
                                        <div ref="card2" className="impact-summary-card pt-3 pb-5">
                                        <Bar
                                        data={impactSummaryBarData}
                                        options={{
                                        maintainAspectRatio: false
                                        }}
                                        />
                                        </div>
                                        </div>
                                        */}
                                    </div>
                                    <div className="row mb-5 mt-5">
                                        <div className="col-md-12">
                                            {/*<div className="text-left">
                                                <button type="btn" className="impact-sumary-btn">
                                                Team History
                                                </button>
                                                </div>
                                                <div ref="card3" className="impact-history-card p-4">
                                                <Bar
                                                data={impactHistoryBarData}
                                                options={{
                                                maintainAspectRatio: false
                                                }}
                                                />
                                                </div>
                                                */}
                                                <div
                                                    ref="card"
                                                    className="col-md-12 pl-0 pr-0 mt-5 data-table-view"
                                                    >
                                                    <div className="btns-group d-flex">
                                                        <RostarBtn
                                                            tabActive={this.toggleTab}
                                                            makeActive={this.state.tabActive}
                                                            getBtn={this.getTargetBtn}
                                                            currentBtn={this.state.targetBtn}
                                                            content="Overview"
                                                            />
                                                        <RostarBtn
                                                            tabActive={this.toggleTab}
                                                            makeActive={this.state.tabActive}
                                                            getBtn={this.getTargetBtn}
                                                            currentBtn={this.state.targetBtn}
                                                            content="Staff"
                                                            />
                                                    </div>
                                                    {!this.state.tabActive ?
                                                    <div ref="table" className="commander-data-table table-responsive ">
                                                        <table style={{whiteSpace:"nowrap"}} className="table ">
                                                            <thead>
                                                                <tr>

                                                                    <th scope="col">#</th>
                                                                    <th scope="col">Player Name</th>
                                                                    {this.props.screenWidth <= 768 ? null :  <th scope="col">Sport</th> }
                                                                    {this.props.screenWidth <= 768 ? null :  <th scope="col">Position</th> }
                                                                    {this.props.screenWidth <= 768 ? null :  <th scope="col">Brain Simulations</th> }
                                                                    <th scope="col">Cumulative Simulation Overview</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="player-table">
                                                                {this.state.users.map(function(player, index){

                                                                    return <tr className="player-data-table-row" key={index} onClick={()=>{

                                                                            this.setRedirectData(Number(index + 1).toString(), player.player_name)
                                                                        }}
                                                                        >
                                                                        <th style={{verticalAlign: "middle"}} scope="row">{index + 1}</th>
                                                                        <td>{player.player_name}</td>
                                                                        {this.props.screenWidth <= 768 ? null :  <td>Football</td> }
                                                                        {this.props.screenWidth <= 768 ? null :  <td>{player.simulation_data[0].position}</td> }
                                                                        {this.props.screenWidth <= 768 ? null :  <td>{player.simulation_data.length}</td> }

                                                                        {/*<td>{Number(player.impact)}</td>*/}
                                                                        <td style={{alignItems : "center"}}>
                                                                            <img style={{
                                                                                    display:"block", width: "15%", height:"auto" , objectFit: "cover"
                                                                                }} className={`img-fluid team-view-brain-image-row-picture`} src="/img/brain_simulation_image.png" alt="" /></td>
                                                                                {/*<td>{Number(player.impact)%(index + 1)*2}</td>*/}
                                                                                {/*<td>0</td>
                                                                                <td>
                                                                                <div className="progress my-progress">
                                                                                <div
                                                                                style={{ width: '3%' }}
                                                                                className="progress-bar my-progress-bar "
                                                                                role="progressbar"
                                                                                aria-valuenow="0"
                                                                                aria-valuemin="0"
                                                                                aria-valuemax="100"
                                                                                ></div>
                                                                                </div>
                                                                                </td>
                                                                                */}
                                                                            </tr>;
                                                                        },this)}

                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            : <div className="commander-data-table">
                                                            <table style={{whiteSpace:"nowrap"}} className="table">
                                                                <thead>
                                                                  <tr>
                                                                    <th scope="col">#</th>
                                                                    <th scope="col">Name</th>
                                                                    <th scope="col">Organization</th>
                                                                    <th scope="col">Department</th>
                                                                  </tr>
                                                                </thead>
                                                                <tbody className="player-table">
                                                                    {this.props.location.state.team.staff.map(function(staff, index){

                                                                        return <tr className="player-data-table-row" key={index}>
                                                                            <td>{index + 1 }</td>
                                                                            <td>{staff.first_name} {staff.last_name}</td>
                                                                            <td>{staff.organization}</td>
                                                                            <td>CTE</td>
                                                                        </tr>
                                                                    })}
                                                                </tbody>

                                                            </table>
                                                        </div>

                                                        }
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    };

                                    render() {
                                        if (!this.state.isLoaded) {
                                            return <Spinner />;
                                        }
                                        impactHistoryBarData.labels = this.state.impactHistoryData.force;
                                        impactHistoryBarData.datasets[0].data = this.state.impactHistoryData.pressure;
                                        impactSummaryBarData.labels = this.state.impactSummaryData.force;
                                        impactSummaryBarData.datasets[0].data = this.state.impactSummaryData.pressure;

                                        if(this.state.cognito_user_id){
                                            return <Redirect push to={{
                                                    pathname: '/TeamAdmin/user/dashboard',
                                                    state: {
                                                        cognito_user_id : this.state.cognito_user_id,
                                                        player_name : this.state.player_name,
                                                        isRedirectedFromAdminPanel : true,
                                                        team: {
                                                           team_name : this.props.location.state.team.team_name,
                                                           organization : this.props.location.state.team.organization,
                                                           staff : this.props.location.state.team.staff
                                                        }
                                                    }
                                                }} />
                                            }


                                            return (
                                                <React.Fragment>
                                                    {this.props.isMilitaryVersionActive === true ? (
                                                        <div className="militay-view">
                                                            <div className="military-sidebar">
                                                                <SideBar />
                                                            </div>
                                                            <div className="military-main-content">
                                                                {this.militaryVersionOrNormal()}
                                                                {/*<DarkMode isDarkMode={this.props.isDarkModeSet} />*/}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <React.Fragment>
                                                            {this.militaryVersionOrNormal()}
                                                            {/*<DarkMode isDarkMode={this.props.isDarkModeSet} />*/}
                                                            <Footer style={{display : "none"}} className="violent"/>
                                                        </React.Fragment>
                                                    )}
                                                </React.Fragment>
                                            );
                                        }
                                    }

                                    function mapStateToProps(state) {
                                        return {
                                            isMilitaryVersionActive: state.militaryVersion
                                        };
                                    }

                                    export default connect(mapStateToProps)(CommanderTeamView);
