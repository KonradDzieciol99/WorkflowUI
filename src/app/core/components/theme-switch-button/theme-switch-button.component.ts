import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
enum Theme {
  Light = "light",
  Dark = "dark",
  Auto = "auto"
}

@Component({
  selector: 'app-theme-switch-button',
  templateUrl: './theme-switch-button.component.html',
  styleUrls: ['./theme-switch-button.component.scss']
})
export class ThemeSwitchButtonComponent implements OnInit, OnDestroy  {
  public themeForm?:FormGroup
  private themeFormValueChangesSub?:Subscription;
  public currentTheme?:string;
  private themeMap: Map<Theme, string>;
  public isNotificationPanelOpen: boolean;

  constructor(@Inject(DOCUMENT) private document: Document ,private renderer2: Renderer2) 
  {
    this.themeMap = new Map<Theme, string>([      
      [Theme.Light,"bi bi-brightness-high-fill"],
      [Theme.Dark,"bi bi-moon-stars-fill"],
      [Theme.Auto,"bi bi-arrow-left-right"]
    ]);
    this.isNotificationPanelOpen = false;
  }
  ngOnInit(): void {
    let theme = localStorage.getItem("theme") as Theme | undefined;

    if (theme!==Theme.Dark && theme!==Theme.Light) 
      theme=Theme.Auto;
       
    this.themeForm = new FormGroup({
      theme: new FormControl(theme),
    })

    this.setTheme(theme);
    this.watchPrefersColorScheme();
    this.watchThemeButton();
  }
  watchPrefersColorScheme() : void {
    this.document.defaultView?.matchMedia(`(prefers-color-scheme: dark)`).addEventListener('change', event => {
      if (this.themeForm?.get('theme')?.value === "auto" ) {
        const newColorScheme = event.matches ? "dark" : "light";
        this.renderer2.setAttribute(this.document.documentElement, 'data-bs-theme', newColorScheme);
      }
    });
  }
  watchThemeButton() {
    this.themeFormValueChangesSub=this.themeForm?.get("theme")?.valueChanges.subscribe(value=>this.setTheme(value))
  }
  private loadSyncfusionStyles(isDarkTheme:boolean): void {
    const themeUrl = isDarkTheme ? "dark.css" : "light.css";
    const linkElementId = 'dynamic-theme-style';
    const head = this.document.head;

    let linkElement = head.querySelector(`#${linkElementId}`);
    if (!linkElement) {
      linkElement = this.renderer2.createElement('link');
      this.renderer2.setAttribute(linkElement, 'id', linkElementId);
      this.renderer2.setAttribute(linkElement, 'rel', 'stylesheet');
      this.renderer2.appendChild(head, linkElement);
    }
    this.renderer2.setAttribute(linkElement, 'href', themeUrl);
  }
  private setTheme(themeFormFieldValue:Theme):void{
   
    if (themeFormFieldValue===Theme.Light) {
      this.renderer2.setAttribute(this.document.documentElement, 'data-bs-theme', Theme.Light);
      this.loadSyncfusionStyles(false);
    }
    if (themeFormFieldValue==='dark') {
      this.renderer2.setAttribute(this.document.documentElement, 'data-bs-theme', Theme.Dark);
      this.loadSyncfusionStyles(true);
    }
    if (themeFormFieldValue==='auto') {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.renderer2.setAttribute(this.document.documentElement, 'data-bs-theme', Theme.Dark);
        this.loadSyncfusionStyles(true);
      }
      else{
        this.renderer2.setAttribute(this.document.documentElement, 'data-bs-theme', Theme.Light);
        this.loadSyncfusionStyles(false);
      }
    }

    localStorage.setItem("theme",themeFormFieldValue)
    this.currentTheme = this.themeMap.get(themeFormFieldValue);
  }

  onOpenChange(isOpen: boolean): void {
    this.isNotificationPanelOpen = isOpen;
  }

  ngOnDestroy(): void {
    if (this.themeFormValueChangesSub) {
      this.themeFormValueChangesSub.unsubscribe();
    }
  }
}

