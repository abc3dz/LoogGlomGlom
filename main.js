import * as THREE from 'https://threejs.org/build/three.module.js';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'https://threejs.org/examples/jsm/libs/dat.gui.module.js'; 
// import * as THREE from '../../build/three.module.js';
// import { OrbitControls } from '../../examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from '../../examples/jsm/loaders/GLTFLoader.js';
// import { GUI } from '../../examples/jsm/libs/dat.gui.module.js'; 
		
let container, clock, gui, mixer, actions ;
let camera, scene, renderer, model, face;

gui = new GUI();
var parameters = 
{
	c: "select one",
	v: false,
	'Audio1': 0.3,
	'Audio2': 0.0,
	'Audio3': 0.0,
	'Audio4': 0.0,
	'Audio5': 0.0,
	reload: function(){location.reload()}
};
let gltfAnim, gltfCha;
			
init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 100 );
	camera.position.set( - 5, 3, 10 );
	camera.lookAt( new THREE.Vector3( 0, 2, 0 ) );
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xe0e0e0 );
	scene.fog = new THREE.Fog( 0xe0e0e0, 20, 100 );

	clock = new THREE.Clock();

	// lights

	const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
	hemiLight.position.set( 0, 20, 0 );
	scene.add( hemiLight );

	const dirLight = new THREE.DirectionalLight( 0xffffff );
	dirLight.position.set( 0, 20, 10 );
	scene.add( dirLight );

				// ground

				const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
				mesh.rotation.x = - Math.PI / 2;
				scene.add( mesh );

				const grid = new THREE.GridHelper( 200, 40, 0x000000, 0x000000 );
				grid.material.opacity = 0.2;
				grid.material.transparent = true;
				scene.add( grid );

				// model
				let modelName = [ "select one", "hr_Zeroface.glb","hr_Argo.glb", "hr_Yinglek.glb", "hr_Oni.glb", "mt_Dada.glb","mt_Jook.glb","mt_Kooku.glb","mt_Manis.glb" ];
				gltfCha = gui.add( parameters, 'c' , modelName).name('Model List').listen();
				gltfCha.onChange(function(value){   
						console.log(scene.children.length)
						// if(value=="Reload"){scene.remove(scene.children[scene.children.length-1]);}
						const loader = new GLTFLoader();
						
						loader.load( './models/'+value, function ( gltf ) {
							model = gltf.scene;
							const morphMeshes = [];
							gltf.scene.traverse( function ( node ) {

								if (node.isMesh && node.morphTargetInfluences) {
								morphMeshes.push(node);
							}
							} );
							console.log(gltf.animations);
							scene.add( model );
							createGUI( model, gltf.animations, morphMeshes );
							
							}, undefined, function ( e ) {
							console.error( e );
						} );
					});
					
				//sound
				var listener = new THREE.AudioListener();
				var sound = new THREE.Audio( listener );
				var audioLoader = new THREE.AudioLoader();
				audioLoader.load( './sounds/BeepBox-Song.mp3', function( buffer ) {
						sound.setBuffer( buffer );
						sound.setLoop( true );
						sound.setVolume( 0.3 );
						sound.play();
				});
				var sound2 = new THREE.Audio( listener );
				audioLoader.load( './sounds/BeepBox-Song2.mp3', function( buffer ) {
					sound2.setBuffer( buffer );
					sound2.setLoop( true );
					sound2.setVolume( 0.0 );
					sound2.play();
				});
				var sound3 = new THREE.Audio( listener );
				audioLoader.load( './sounds/LGG_monster.mp3', function( buffer ) {
					sound3.setBuffer( buffer );
					sound3.setLoop( true );
					sound3.setVolume( 0.0 );
					sound3.play();
				});
				var sound4 = new THREE.Audio( listener );
				audioLoader.load( './sounds/LGG_Rhythm.mp3', function( buffer ) {
					sound4.setBuffer( buffer );
					sound4.setLoop( true );
					sound4.setVolume( 0.0 );
					sound4.play();
				});
				var sound5 = new THREE.Audio( listener );
				audioLoader.load( './sounds/PowerUp.mp3', function( buffer ) {
					sound5.setBuffer( buffer );
					sound5.setLoop( true );
					sound5.setVolume( 0.0 );
					sound5.play();
				});
				
				var volumeFolder = gui.addFolder( 'Sound volume' );
				volumeFolder.add( parameters, 'Audio1' ).min( 0.0 ).max( 1.0 ).step( 0.01 ).onChange( function () {
									sound.setVolume( parameters.Audio1 );
						} );
				volumeFolder.add( parameters, 'Audio2' ).min( 0.0 ).max( 1.0 ).step( 0.01 ).onChange( function () {
									sound2.setVolume( parameters.Audio2 );
								} );
				volumeFolder.add( parameters, 'Audio3' ).min( 0.0 ).max( 1.0 ).step( 0.01 ).onChange( function () {
								sound3.setVolume( parameters.Audio3 );
						} );
				volumeFolder.add( parameters, 'Audio4' ).min( 0.0 ).max( 1.0 ).step( 0.01 ).onChange( function () {
								sound4.setVolume( parameters.Audio4 );
						} );
				volumeFolder.add( parameters, 'Audio5' ).min( 0.0 ).max( 1.0 ).step( 0.01 ).onChange( function () {
								sound5.setVolume( parameters.Audio5 );
						} );		
				
				
				//render
				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.outputEncoding = THREE.sRGBEncoding;
				container.appendChild( renderer.domElement );
				
				const controls = new OrbitControls( camera, renderer.domElement );
				controls.target.set( 0, 1, 0 );
				controls.update();

				window.addEventListener( 'resize', onWindowResize );

			}

			function createGUI( model, animations, morphMeshes ) {
				const animFolder = gui.addFolder('Actions');
				const expressionFolder = gui.addFolder( 'Expressions' );

				mixer = new THREE.AnimationMixer( model );
				
				actions = {};

				for ( let i = 0; i < animations.length; i ++ ) {

					const clip = animations[ i ];
					const action = mixer.clipAction( clip );
					actions[ clip.name ] = action;
					
					// gltfAnim = gui.add( parameters, 'v' ).name(clip.name).listen();
					
					gltfAnim = animFolder.add(parameters, 'v' ).name(clip.name).listen();
					gltfAnim.onChange(function(value) 
					{   
						if(value)
							actions[ clip.name ].play();
						else
							actions[ clip.name ].stop();
					});
				}
				animFolder.open();
				
				//expressions	
				const expressions = Object.keys( morphMeshes[0].morphTargetDictionary );
				

				for ( let i = 0; i < expressions.length; i ++ ) {

					expressionFolder.add( morphMeshes[0].morphTargetInfluences, i, -1, 1, 0.01 ).name( expressions[ i ] );

				}	
				expressionFolder.open();	
				//reload
				gui.add( parameters, 'reload').name('Reload');		
			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			//

			function animate() {
				const dt = clock.getDelta();
				if ( mixer ) mixer.update( dt );
				requestAnimationFrame( animate );
				renderer.render( scene, camera );
			}