import React from 'react';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import brain from './brain.glb';
import modelTexture from './textures/Br_color.jpg';
import frontTexture from './textures/front.jpg';
import parientalTexture from './textures/pariental.jpg';
import occipitalTexture from './textures/occipital.jpg';
import temporalTexture from './textures/temporal.jpg';
import cerebellumTexture from './textures/cerebellum.jpg';
import Footer from '../../components/Footer';
import { getStatusOfDarkmode } from '../../reducer';
import {Bar} from 'react-chartjs-2';
import './dash.css';

const options = {
    scales: {
        yAxes: [{
            scaleLabel: {
                display: true,
                labelString: 'Number of MASxSR 7.5  Thresholds Exceeded'
            },
            ticks: {
                min: 0
            }
        }],
        xAxes: [{
			scaleLabel: {
                display: false,
                labelString: 'Angular Acceleration'
            },
			ticks: {
				display: false //this will remove only the label
			}
        }]
    },
	legend: {
		display: false
	},
	tooltips: {
		callbacks: {
			title: function(tooltipItem, data) {
				//return data['labels'][tooltipItem[0]['index']];
			},
			label: function(tooltipItem, data) {
				return ' ' + data['datasets'][0]['data'][tooltipItem['index']] + ' Events';
			}
		},
		displayColors: false
	}
};

let obj;
let defaultBarColors = ['#7CB5EC', '#7CB5EC', '#7CB5EC', '#7CB5EC', '#7CB5EC'];

var manager = new THREE.LoadingManager();
var textureLoader = new THREE.TextureLoader(manager);

class DashPage extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			condition: false,
			barColors: defaultBarColors
		};
	}
	
	componentDidMount() {
		// Scrolling the screen to top
		window.scrollTo(0, 0)

		if (getStatusOfDarkmode().status === true) {
			document.getElementsByTagName('body')[0].style.background = '#171b25';
			for (let i = 1; i <= 8; i++){
				this.refs['h' + i].style.color = '#fff';
			}
		}
		
		this.sceneSetup();
		this.loadModel(brain);
		
		this.startAnimationLoop();
		//this.setContainerHeight();
	}
  
	setContainerHeight = () => {
		let docHeight = document.body.clientHeight;
		let headerHeight = document.querySelector('.navbar').clientHeight;
		let footerHeight = document.querySelector('.footer').clientHeight;
		let conatainerHeight = parseFloat(docHeight) - parseFloat(headerHeight) - parseFloat(footerHeight);
		document.querySelector(".dash_container").style.minHeight = conatainerHeight + 'px';
	}
	
	sceneSetup = () => {
		// get container dimensions and use them for scene sizing
		const width = window.innerWidth;
		const height = window.innerHeight;
		
		const canvas1 = document.querySelector('#brain_model_block_1');
		
		this.renderer1 = new THREE.WebGLRenderer();
		//this.renderer1.setSize( window.innerWidth, window.innerHeight / 2 );
		canvas1.appendChild( this.renderer1.domElement );
		this.renderer1.gammaOutput = true;
		this.renderer1.gammaFactor = 2.2;
		
		const canvas2 = document.querySelector('#brain_model_block_2');
		
		this.renderer2 = new THREE.WebGLRenderer({antialias:true});
		canvas2.appendChild( this.renderer2.domElement );
		this.renderer2.gammaOutput = true;
		this.renderer2.gammaFactor = 2.2;
		
		const canvas3 = document.querySelector('#brain_model_block_3');
		
		this.renderer3 = new THREE.WebGLRenderer({antialias:true});
		canvas3.appendChild( this.renderer3.domElement );
		this.renderer3.gammaOutput = true;
		this.renderer3.gammaFactor = 2.2;
		
		const canvas4 = document.querySelector('#brain_model_block_4');
		
		this.renderer4 = new THREE.WebGLRenderer({antialias:true});
		canvas4.appendChild( this.renderer4.domElement );
		this.renderer4.gammaOutput = true;
		this.renderer4.gammaFactor = 2.2;

		this.scene = new THREE.Scene();
		//this.scene.background = new THREE.Color( 0x8FBCD4 );
		this.scene.background = new THREE.Color( "rgb(255, 255, 255)" );
		
		this.camera = new THREE.PerspectiveCamera( 25, width / height, 0.01, 1000 );
		this.camera.position.set(0, 0, 0.3);

		this.light = new THREE.DirectionalLight( 0xffffff, 0.5 );
		this.light.position.copy( this.camera.position );
		this.scene.add( this.light );
		
		const ambientLight = new THREE.AmbientLight( 0x404040, 1);
		this.scene.add( ambientLight );
			
	    // prepare controls (OrbitControls)
		this.controls = new OrbitControls(this.camera);
		//this.controls.autoRotate = true;
		//this.controls.minPolarAngle = Math.PI * 0.5;
		//this.controls.maxPolarAngle  = Math.PI * 0.5;
		
		this.controls.addEventListener( 'change', this.lightUpdate );
		
		// to disable keyboard keys
		this.controls.enableKeys = false;
		
		// to disable zoom
		this.controls.enableZoom = false;

		// to disable rotation
		this.controls.enableRotate = false;
		
		//this.controls.minDistance = 2;
		//this.controls.maxDistance = 10;
	};
	
	lightUpdate = () => {
		this.light.position.copy( this.camera.position );
	}
  
	loadModel = (model) => {
		const scene  = this.scene;
		const me  = this;
		
		scene.remove( obj );
		
		me.setState({
			isLoading: true
		});
		
		var loader = new GLTFLoader();
				
		// Load a glTF resource
		loader.load(
			// resource URL
			model,
			// called when the resource is loaded
			function ( gltf ) {
						
				obj = gltf.scene;
				
				var map = textureLoader.load(modelTexture);
				map.encoding = THREE.sRGBEncoding;
				//map.flipY = false;
				
				manager.onStart = function () {
					console.log('Loading started');
					me.setState({
						isLoading: true
					});
				};
				
				manager.onLoad = function () {
					console.log('loaded');
					me.setState({
						isLoading: false
					});
					var material = new THREE.MeshPhongMaterial({map: map, transparent: true, opacity: 0.5, cache: true});
					obj.traverse( function ( node ) {
						node.material = material;
						node.material.needsUpdate = true;
						node.castShadow = true;
						node.receiveShadow = true;
					});
				
					scene.add( obj );
					
					me.generateSphere(0.01, 0.02, 0.05, 'sphere1');
					me.generateSphere(-0.03, 0.02, -0.06, 'sphere2');
					me.generateSphere(0.03, 0, -0.07, 'sphere3');
					me.generateSphere(0.03, -0.03, 0, 'sphere4');
					me.generateSphere(-0.03, -0.05, -0.03, 'sphere5');
					
				};
			},
			// called while loading is progressing
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			// called when loading has errors
			function ( error ) {
				alert( 'An error happened' );
				console.log( error );
				me.setState({
					isLoading: false
				});
				
			}
		);
	};
	
	generateSphere = (x, y, z, sphereName) => {
		var geometry = new THREE.SphereGeometry( 0.005, 32, 32 );
		var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
		var sphere = new THREE.Mesh( geometry, material );
		sphere.position.set(x, y, z);
		sphere.name = sphereName;

		this.scene.add(sphere);
	};
	
	removeSpheres = (x, y, z, sphereName) => {
		var k;
		for (k = 1; k <= 5; k++ ) {
			var sphereObject = this.scene.getObjectByName("sphere" + k);
			this.scene.remove(sphereObject);
		}
	};
	
	loadTexture = (texture, type) => {

		if (this.state.isLoading) {
			return false;
		}
		
		this.setState( { condition : !this.state.condition } );
		
		let barColors = defaultBarColors;
		
		switch(type) {
			case "front_btn":
				barColors = ['rgba(255,255,102)', '#7CB5EC', '#7CB5EC', '#7CB5EC', '#7CB5EC'];
				break;
			case "pariental_btn":
				barColors = ['#7CB5EC', 'rgba(255,255,102)', '#7CB5EC', '#7CB5EC', '#7CB5EC'];
				break;
			case "occipital_btn":
				barColors = ['#7CB5EC', '#7CB5EC', 'rgba(255,255,102)', '#7CB5EC', '#7CB5EC'];
				break;
			case "temporal_btn":
				barColors = ['#7CB5EC', '#7CB5EC', '#7CB5EC', 'rgba(255,255,102)', '#7CB5EC']
				break;
			case "cerebellum_btn":
				barColors = ['#7CB5EC', '#7CB5EC', '#7CB5EC', '#7CB5EC', 'rgba(255,255,102)'];
				break;
		}
	
		this.setState({
			barColors: barColors
		});
		
		var x = document.getElementsByClassName("lobe_btn");
		var i;
		for (i = 0; i < x.length; i++) {
			x[i].classList.remove("active");
		}
		
		document.getElementById(type).classList.add("active");
				
		const me  = this;
		manager.onStart = function () {
			console.log('Loading started');
			me.setState({
				isLoading: true
			});
		};
		
		var map = textureLoader.load(texture);
		map.encoding = THREE.sRGBEncoding;
		//map.flipY = false;
				
		manager.onLoad = function () {
			console.log('loaded');
			me.setState({
				isLoading: false
			});
			var material = new THREE.MeshPhongMaterial({map: map, transparent: true, opacity: 0.5, cache: true});
			obj.traverse( function ( node ) {
				node.material = material;
				node.material.needsUpdate = true;
				node.castShadow = true;
				node.receiveShadow = true;
			});
			
			// Remove prev spheres
			me.removeSpheres();
			
			// Add new spheres
			switch(type) {
				case "front_btn":
					me.generateSphere(0.01, 0.02, 0.05, 'sphere1');
					me.generateSphere(-0.02, 0.02, 0.05, 'sphere2');
					me.generateSphere(0, 0.05, 0.03, 'sphere3');
					break;
				case "pariental_btn":
					me.generateSphere(0.01, 0.02, -0.06, 'sphere1');
					me.generateSphere(-0.03, 0.02, -0.06, 'sphere2');
					me.generateSphere(-0.03, 0.05, -0.03, 'sphere3');
					break;
				case "occipital_btn":
					me.generateSphere(0.03, 0, -0.07, 'sphere1');
					me.generateSphere(0, 0, -0.07, 'sphere2');
					me.generateSphere(-0.03, 0, -0.07, 'sphere3');
					break;
				case "temporal_btn":
					me.generateSphere(-0.04, -0.03, 0.01, 'sphere1');
					me.generateSphere(0.04, -0.03, 0.01, 'sphere2');
					me.generateSphere(0.03, -0.03, 0, 'sphere3');
					break;
				case "cerebellum_btn":
					me.generateSphere(0.03, -0.05, -0.03, 'sphere1');
					me.generateSphere(0, -0.05, -0.03, 'sphere2');
					me.generateSphere(-0.03, -0.05, -0.03, 'sphere3');
					break;
			}
			
			console.log('change texture');
		};
	}

	startAnimationLoop = () => {
		if (this.resizeRendererToDisplaySize(this.renderer1)) {
			const canvas = this.renderer1.domElement;
			this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
			this.camera.updateProjectionMatrix();
		}
	
		this.camera.position.set(0, 0, 0.3);
		this.controls.update();
		
		this.renderer1.render(this.scene, this.camera);
		
		this.camera.position.set(0, 0.36, 0);
		this.controls.update();
		
		this.renderer2.render(this.scene, this.camera);
		
 		this.camera.position.set(-0.3, 0.2, 0);
		this.controls.update();
		
		this.renderer3.render(this.scene, this.camera);
				
		this.camera.position.set(-0.2, 0.2, 0.2);
		this.controls.update();
		
		this.renderer4.render(this.scene, this.camera);
				
				
		// The window.requestAnimationFrame() method tells the browser that you wish to perform
		// an animation and requests that the browser call a specified function
		// to update an animation before the next repaint
		this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
	};

	resizeRendererToDisplaySize = (renderer)  => {
		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
			this.renderer1.setSize(width, height, false);
			this.renderer2.setSize(width, height, false);
		}
		return needResize;
    }

  render() {
	  
	 const data = {
		labels: [857, 1173, 3043, 1173, 1200],
		datasets: [{
			label: "Events",
			lineTension: 0.1,
			backgroundColor: this.state.barColors,
			borderColor: '#1987DD',
			hoverBackgroundColor: 'rgba(255,255,102)',
			hoverBorderColor: 'rgba(255,255,102)',
			data: [10, 8, 6, 11, 4]
		}]
	}; 
	  
    return (
		<React.Fragment>
			<div class="container dashboard player-top-margin-20-mobile">
				<div class="row cumm mb-5 ">
					<div class="col-md-12 col-lg-12 dash_container">
						<h1 ref="h1" style={{
								textAlign: "center",
								marginBottom : "2%"
							}} className="top-heading__login player-dashboard-title">
						  Player Dashboard
						</h1>
						<div className="card  pt-3 pb-3 pl-2 pr-2 mb-5 animated fadeInLeft"
						style={{
							border: "2px solid #0F81DC",
							borderRadius: "1.8rem"
						}}
						>
							<div className="row">
								<div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
									<p
									ref="h1"
									className="player-dashboard-sub-head"
									>Cumulative Overview of All Events</p>
								</div>
								<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
									<button style={{
											marginRight : "5% !important"
										}} className="btn btn-primary pull-right sub-head-button"><i class="fa fa-arrow-circle-o-down" aria-hidden="true"></i> Export Player Report</button>
								</div>
							</div>

							<div className="row text-center">
								<div className="col-md-5 d-flex align-items-center justify-content-center" >
									{this.state.isLoading ? (
										<div className="model_loader d-flex justify-content-center center-spinner">
											<div
											  className="spinner-border text-primary"
											  role="status"
											>
											  <span  className="sr-only">Loading...</span>
											</div>
										 </div>
										) : null}
										<div>
											<div id="brain_model_block_1" className="brain_model" ></div>
											<div id="brain_model_block_2" className="brain_model"></div><br/>
											<div id="brain_model_block_3" className="brain_model"></div>
											<div id="brain_model_block_4" className="brain_model"></div>
										</div>
								</div>
								<div className="col-md-7">
								    <Bar data={data} options={options}/>
									<div className="action_btn_block">
										<button onClick={() => this.loadTexture(frontTexture, 'front_btn')} className="btn btn-primary lobe_btn" id="front_btn">Front Lobe</button>
										<button onClick={() => this.loadTexture(parientalTexture, 'pariental_btn')} className="btn btn-primary lobe_btn" id="pariental_btn">Pariental Lobe</button>
										<button onClick={() => this.loadTexture(occipitalTexture, 'occipital_btn')} className="btn btn-primary lobe_btn" id="occipital_btn">Occipital Lobe</button>
										<button onClick={() => this.loadTexture(temporalTexture, 'temporal_btn')} className="btn btn-primary lobe_btn" id="temporal_btn">Temporal Lobe</button>
										<button onClick={() => this.loadTexture(cerebellumTexture, 'cerebellum_btn')} className="btn btn-primary lobe_btn cerebellum_btn" id="cerebellum_btn">Cerebellum Lobe</button>	
									</div>
									<div>
										<span className="brain_txt">Select a Brain Region </span>
										<button onClick={() => this.loadTexture(modelTexture, 'reset_btn')} className="btn btn-primary reset_btn" id="reset_btn">Reset</button>	
									</div>
								</div>
							</div>
						
						</div>
					</div>
				</div>
			</div>
		<Footer />
	</React.Fragment>
    );
  }
}

export default DashPage;
