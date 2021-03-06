import React from 'react';
import {Line} from 'react-chartjs-2';



const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
        yAxes: [{
            scaleLabel: {
                display: true,
                labelString: 'Linear Acceleration'
            },
            ticks: {
                min: 0
              }
        }],
        xAxes: [{

            scaleLabel: {
                display: true,
                labelString: 'Time (ms)'
            }
        }]
    }
};


const optionsMaxStrain = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
        yAxes: [{
            scaleLabel: {
                display: true,
                labelString: 'Max Strain'
            },
            ticks: {
                min: 0
              }
        }],
        xAxes: [{

            scaleLabel: {
                display: true,
                labelString: 'Time (ms)'
            }
        }]
    }
};

class HeadAccelerationAllEvents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data : {
            labels: this.props.data.time,
            datasets: [{
                lineTension: 0.1,
                label: "Linear Acceleration Vs Time",
                backgroundColor: '#7CB5EC',
                borderColor: '#1987DD',
                data: this.props.data.max_linear_acceleration,
            }]

        },
        dataMaxStrain : {
            labels: this.props.data.time,
            datasets: [{
                lineTension: 0.1,
                label: "Max. Strain Vs Time",
                backgroundColor: '#7CB5EC',
                borderColor: '#1987DD',
                data: this.props.data.max_linear_acceleration,
            }]

        },
        is_selfie_simulation_file_uploaded : props.is_selfie_simulation_file_uploaded,
        imageUrl : props.imageUrl
    };
  }

  render() {
    return (
      <div  className="position-relative animated fadeInRight  bg-white acc-evnt">
      {/*<div  data-descr={`${new Date(Number(this.props.data.timestamp)).toDateString()} ${new Date(Number(this.props.data.timestamp)).toLocaleTimeString()}`} className="position-relative head-acc-evnt-chart pl-2 pr-2">*/}
      <div  data-descr={`${new Date(Number(this.props.data.timestamp)).toDateString()} ${this.props.data.record_time}`} className="position-relative head-acc-evnt-chart pl-2 pr-2">
        <div className="brain-card-pt-2-5 row pl-4 pr-4 pb-4 dark-bg text-center ">




          <div className="col-md-4 ">

              <Line data={this.state.data} options={options}/>

          </div>
          <div className="col-md-4 d-flex ">

          <div className="col-md-12">
{/*{(this.state.is_selfie_simulation_file_uploaded)?<div><img className={`img fluid ${'svg'}`} src="/img/icon/brainEvnt.svg" alt="" /><img width="60%"  height="60%" className={`img-fluid ${'svg'}`} src={this.state.imageUrl} alt="" /> </div> : <img className={`img fluid ${'svg'}`} width="60%"  height="60%" src="/img/icon/brainEvnt.svg" alt="" />}*/}
{(this.state.is_selfie_simulation_file_uploaded)?<div><img className={`img fluid ${'svg'}`} width="60%"  height="60%" src="/img/brain_simulation_image.png" alt="" /><img width="60%"  height="60%" className={`img-fluid ${'svg'}`} src={this.state.imageUrl} alt="" /> </div> : <img className={`img-fluid ${'svg'}`} width="60%"  height="60%" src="/img/brain_simulation_image.png" alt="" />}
          </div>
{/*
          <div className="col-md-4">
    <div class="widget-chart-content">
                <div class="widget-subheading">Position</div>
                    <div class="widget-numbers">
                        <span>DE/RT</span>
                    </div>
                </div>
                <div class="widget-chart-content">
                      <div class="widget-subheading">Impact Location</div>
                          <div class="widget-numbers">
                              <span>DE/RT</span>
                          </div>
                      </div>
          </div>
          <br/>

*/}

          </div>
          <div className="col-md-4">
                  <Line data={this.state.dataMaxStrain} options={optionsMaxStrain}/>
          </div>
        </div>
        </div>
        </div>
    );
  }
}

export default HeadAccelerationAllEvents;
