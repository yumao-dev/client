import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  tap,
} from 'rxjs/operators';
import { LayoutService } from '../service/layout.service';

enum UserStatus {
  online = 0,
  away = 1,
  offline = 2,
}
interface ContactUser {
  href: string;
  avatar: string;
  name: string;
  message: string;
  status: UserStatus;
  lasttime?: Date;
}

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss'],
})
export class RightSidebarComponent implements OnInit {
  // @Input() show: boolean;
  currentUser: ContactUser | undefined;
  public currentStyle: ThemePalette = 'primary';
  contactUsers!: Observable<Array<ContactUser>>;
  search = new BehaviorSubject<string | null>(null);
  constructor(public layoutService: LayoutService) {}

  public users: Array<ContactUser> = [
    {
      href: '#',
      avatar: 'assets/img/avatar1.png',
      name: 'Claire Sassu',
      message: 'Can you share the...',
      status: UserStatus.online,
    },
    {
      href: '#',
      avatar: 'assets/img/avatar2.png',
      name: 'Maggie jackson',
      message: 'I confirmed the info.',
      status: UserStatus.away,
    },
    {
      href: '#',
      avatar: 'assets/img/avatar3.png',
      name: 'Joel King ',
      message: 'Ready for the meeti...',
      status: UserStatus.offline,
    },
  ];

  ngOnInit() {
    this.contactUsers = this.search.pipe(
      filter((a) => !!a),
      tap((event) => {
        console.log(event);
      }),
      debounceTime(1000),
      distinctUntilChanged(),
      mergeMap((search) => {
        return of(this.users).pipe(
          map((user, index) => {
            return user.filter((b) => {
              if (b && b.name) {
                return b.name.toLowerCase().includes(search!.toLowerCase());
              } else {
                return false;
              }
            });
          })
        );
      })
    );
  }

  enterChat = (user: ContactUser) => {
    this.currentUser = user;
  };
  quitChat = () => {
    this.currentUser = undefined;
  };
  changeColor = (value: ThemePalette) => {
    this.layoutService.style = value;
  };

  searchUser = (event: Event) => {
    this.search.next((<any>event.target).value);
  };
}
