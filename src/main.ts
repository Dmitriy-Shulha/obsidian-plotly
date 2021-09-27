import { App, Modal, Notice, Plugin, PluginSettingTab, Setting, Menu, Editor, MarkdownView } from 'obsidian';
import { addIcons, PLOTLY_LOGO } from "./ui/icons";
import { preprocessor } from './preprocessor';
import PlotlyModal from './ui/modal';
import PlotlyPluginSettingTab from './ui/settingsTab'
import './show-hint'

const NEW_PLOTLY_CHART_NAME = "New Plotly Chart";
const newPlotlyChart = (editor: Editor)=>{
	let doc = editor.getDoc();
	let cursor = doc.getCursor();
	doc.replaceRange("```plotly\ndata:\n\t- x: [0,1,2]\n\t  y: [0,1,0]\n```\n", cursor);
}

export default class PlotlyPlugin extends Plugin {
	settingsTab: PlotlyPluginSettingTab;

	async onload() {
		console.log('loading Plotly plugin');
		
		this.settingsTab = new PlotlyPluginSettingTab(this.app, this)
		await this.settingsTab.loadSettings();
		// this.addSettingTab(this.settingsTab);

		addIcons();

		this.registerCodeMirror((cm: CodeMirror.Editor) => {
			console.log('codemirror', cm);
		});

		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));

		this.registerMarkdownCodeBlockProcessor('plotly', preprocessor);

		//@ts-ignore
		this.registerEvent(this.app.workspace.on('editor-menu',
		(menu: Menu, editor: Editor, view: MarkdownView) => {
			if (view) {
				menu.addItem((item) => {
					item.setTitle(NEW_PLOTLY_CHART_NAME)
						.setIcon(PLOTLY_LOGO)
						.onClick((_)=>newPlotlyChart(editor));
				});
			}
		}));

		this.addCommand({
			id: "add-plotly-example",
			name: NEW_PLOTLY_CHART_NAME,
			editorCallback: (editor: Editor, view: MarkdownView)=>newPlotlyChart(editor)
		});
	}

	onunload() {
		console.log('unloading Plotly plugin');
	}
}
