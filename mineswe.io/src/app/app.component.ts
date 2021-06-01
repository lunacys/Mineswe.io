import { Component, ElementRef, NgZone, OnInit } from "@angular/core";
import * as PIXI from "pixi.js";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthServiceService } from "../services/auth-service.service";

export interface WeatherData {
	date: Date;
	temperatureC: number;
	temperatureF: number;
	summary: string;
}

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
	title = "minesweio";

	public readonly gameWidth = 800;
	public readonly gameHeight = 600;
	private app: PIXI.Application;
	public colorCornflowerBlue = 0x6495ed;
	private stage: PIXI.Container;

	public testDataFromServer: WeatherData[] | null = null;

	constructor(private elementRef: ElementRef, private ngZone: NgZone, private http: HttpClient, private authService: AuthServiceService) {
		this.app = new PIXI.Application({
			backgroundColor: this.colorCornflowerBlue,
			width: this.gameWidth,
			height: this.gameHeight,
			antialias: true,
			autoDensity: true,
			resolution: window.devicePixelRatio,
		});

		this.stage = this.app.stage;
	}

	async ngOnInit(): Promise<void> {
		await this.ngZone.runOutsideAngular(async () => {
			try {
				await this.loadGameAssets();
			} catch (ex) {
				console.error("Exception while loading game assets: ", ex);
			}

			this.resizeCanvas();

			this.initialize();
		});

		await this.ngZone.run(args => {

		});

		this.elementRef.nativeElement.appendChild(this.app.view);

		this.http.get<WeatherData[]>("https://localhost:44328/WeatherForecast").subscribe(result => {
			this.testDataFromServer = result;
			console.log(this.testDataFromServer);
		}, error => console.error(error));

		await this.authService.auth("SeedTest1", "masterkey");
		/*const options = {
			headers: new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded")
		};

		const body = new URLSearchParams();
		body.set("Username", "SeedTest1");
		body.set("Password", "masterkey");

		this.http.post<UserData>("https://localhost:44328/auth/doAuth", body.toString(), options).subscribe(result => {
			console.log(result);
		}, error => console.error(error));*/

		/*this.http.get("https://localhost:44359/WeatherForecast")
			.toPromise()
			.then((response) => {
				this.testDataFromServer = <WeatherData>response;
				console.log("Data: ", this.testDataFromServer);
			});*/
	}

	initialize(): void {
		const mineField = this.getMineField();
		mineField.pivot.x = 200;
		mineField.pivot.y = 200;
		mineField.position.x = window.innerWidth / 2;
		mineField.position.y = window.innerHeight / 2;
		const f2 = <PIXI.Sprite>mineField.getChildAt(1);
		f2.interactive = true;
		/*f2.tint = 0xff0000;*/
		f2.on("mouseover", ($event) => {
			f2.tint = 0xff0000;
			//f2.scale.x += 0.2;
			//f2.scale.y += 0.2;
			f2.zIndex += 1000;
			spinnerContainer.position.set(mineField.x, mineField.y);
			console.log("mouseenter - sprite");
		});
		f2.on("mouseout", ($event) => {
			f2.tint = 0xffffff;
			//f2.scale.x -= 0.2;
			//f2.scale.y -= 0.2;
			f2.zIndex -= 1000;
			console.log("mouseleave - sprite");
		});

		mineField.on("click", () => {
			console.log("mouseenter - mineField [on]");
		});
		mineField.addListener("click", () => {
			console.log("mouseenter - mineField [addListener]");
		});

		f2.addListener("mouseenter", () => {
			console.log("mouseover [addListener]");
		});

		this.stage.addChild(mineField);

		window.addEventListener("wheel", ($event) => {
			if ($event.deltaY < 0 && mineField.scale.x < 3.0) {
				mineField.scale.x += 0.25;
				mineField.scale.y += 0.25;
			}
			if ($event.deltaY > 0 && mineField.scale.x > 0.25) {
				mineField.scale.x -= 0.25;
				mineField.scale.y -= 0.25;
			}
		});

		let oldMouseX = 0;
		let oldMouseY = 0;
		let dtX = 0;
		let dtY = 0;
		let mouseX = 0;
		let mouseY = 0;
		let dragging = false;

		window.addEventListener("mousemove", ($event) => {
			mouseX = $event.clientX;
			mouseY = $event.clientY;

			dtX = $event.clientX - oldMouseX;
			dtY = $event.clientY - oldMouseY;

			oldMouseX = $event.clientX;
			oldMouseY = $event.clientY;

			if (dragging) {
				mineField.position.x -= dtX;
				mineField.position.y -= dtY;
			}
		});

		window.addEventListener("mousedown", ($event) => {
			if ($event.button == 1) {
				$event.preventDefault();
				dragging = true;
			}
		});
		window.addEventListener("mouseup", ($event) => {
			if ($event.button == 1) {
				$event.preventDefault();
				/*mineField.position.x += dtX;
        mineField.position.y += dtY;*/
				dragging = false;
			}
		});
		window.addEventListener("keypress", ($event) => {
			console.log(`keypress: ${$event.key}, code: ${$event.code}`);
		});
		window.addEventListener("keydown", ($event) => {
			console.log(`keydown: ${$event.key}, code: ${$event.code}`);
		});
		window.addEventListener("keyup", ($event) => {
			console.log(`keyup: ${$event.key}, code: ${$event.code}`);
		});

		let spinnerContainer: PIXI.Container;

		const generateSpinner = (position: PIXI.Point) => {
			const container = new PIXI.Container();
			spinnerContainer = container;
			container.interactive = true;
			container.position.set(position.x, position.y);
			this.stage.addChild(container);

			const halfCircle = new PIXI.Graphics();
			halfCircle.beginFill(0xff0000);
			halfCircle.lineStyle(2, 0xffffff);
			halfCircle.arc(0, 0, 100, 0, Math.PI);
			halfCircle.endFill();
			halfCircle.position.set(50, 50);

			const rectangle = new PIXI.Graphics();
			rectangle.lineStyle(5, 0x444444, 1);
			rectangle.drawRoundedRect(0, 0, 100, 100, 16);
			rectangle.endFill();
			rectangle.mask = halfCircle;
			rectangle.zIndex = -100000;

			container.addChild(rectangle);
			container.addChild(halfCircle);

			container.pivot.set(50, 50);

			let phase = 0;
			return (delta: number) => {
				// Update phase
				phase += delta / 50;
				phase %= Math.PI * 2;

				halfCircle.rotation = phase;
			};
		};

		let totalTime = 0;

		const spinners = [generateSpinner(new PIXI.Point(128, 128))];

		function gameLoop(delta: number): void {
			// birdFromSprite.x += birdSpeed * delta;
			//mineField.scale.x += 0.01;
			//mineField.scale.y += 0.01;
			// mineField.rotation += 0.01;
			totalTime += delta;
			//const a = (Math.sin(totalTime / 20) + 1);
			// generateSpinner(new PIXI.Point(128, 128))(delta);
			//console.log(a);

			spinners.forEach((cb) => {
				cb(delta);
			});
		}

		if (this.app) {
			this.app.ticker.add((delta) => gameLoop(delta));
		}
	}

	async loadGameAssets(): Promise<void> {
		return new Promise((res, rej) => {
			const loader = PIXI.Loader.shared;
			loader.add("mineField", "./assets/Tileset_Field.json");

			loader.onComplete.once(() => {
				res();
			});

			loader.onError.once((err) => {
				rej(err);
			});

			loader.load();
		});
	}

	resizeCanvas(): void {
		const resize = () => {
			if (this.app) {
				//this.app.renderer.resize(window.innerWidth, window.innerHeight);
			}
			//app.stage.scale.x = window.innerWidth / gameWidth;
			//app.stage.scale.y = window.innerHeight / gameHeight;
		};

		resize();

		window.addEventListener("resize", resize);
	}

	getBird(): PIXI.Sprite {
		const bird = new PIXI.Sprite(PIXI.Texture.from("cellOpen1.png"));

		//bird.loop = true;
		//bird.animationSpeed = 0.1;
		//bird.play();
		//bird.scale.set(3);

		return bird;
	}

	getMineField(): PIXI.Container {
		const container = new PIXI.Container();

		const cell1 = new PIXI.Sprite(PIXI.Texture.from("cellOpen1.png"));
		cell1.pivot.set(50, 50);
		cell1.position.set(100, 100);
		const cell2 = new PIXI.Sprite(PIXI.Texture.from("cellOpen2.png"));
		cell2.pivot.set(50, 50);
		cell2.position.set(200, 100);
		const cellClosed = new PIXI.Sprite(PIXI.Texture.from("cellClosed.png"));
		cellClosed.pivot.set(50, 50);
		cellClosed.position.set(100, 200);
		const cellOpen = new PIXI.Sprite(PIXI.Texture.from("cellOpenEmpty.png"));
		cellOpen.pivot.set(50, 50);
		cellOpen.position.set(200, 200);

		container.addChild(cell1);
		container.addChild(cell2);
		container.addChild(cellClosed);
		container.addChild(cellOpen);

		return container;
	}
}
