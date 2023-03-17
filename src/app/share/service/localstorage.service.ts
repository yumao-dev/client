import { Injectable, OnDestroy } from '@angular/core';
import { fromEvent, merge, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService implements OnDestroy {
  private storage = localStorage;
  //  变异主体 返回订阅时的最新的值 缓存了最后的一个值
  // private subject = new BehaviorSubject<{ key: string, value: string }>({ key: 'initkey', value: 'initval' });
  // 普通的主体
  private subject = new Subject<{ key: string; value: string }>();

  //  给微信用户(Observable)关注提供的方法
  // public get storagechange(): Observable<{ key: string, value: string }> {
  //     return this.subject.asObservable();
  // }

  public GetValue(newkey: string) {
    // localStorageService;
    // sessionStorage;
    // return merge(of({ key: newkey, value: this.getItem(newkey) }), this.subject.asObservable())
    return this.subject.pipe(
      filter((item, index) => {
        return item.key === newkey;
      }),
      map((v) => v.value),
      startWith(this.getItem(newkey)),
      // delay(1000),
      distinctUntilChanged()
    );
  }

  constructor() {
    if (!window.localStorage) {
      throw new Error('Current browser does not support Local Storage');
    }
    this.storage = localStorage;
    const orignalSetItem = this.storage.setItem;
    this.storage.setItem = function (key, value) {
      orignalSetItem.apply(
        this,
        arguments as unknown as [key: string, value: string]
      );
      // dispatchEvent 是同步方法 如果先放dispatchEvent 会导致GetValue方法后面中取storage中的值时会出现为上一个值的情况，所以我把dispatchEvent 放后面了
      window.dispatchEvent(
        new StorageEvent('setItemEvent', {
          newValue: value,
          key: key,
        })
      );
    };
    const orignalRemoveItem = this.storage.removeItem;
    this.storage.removeItem = function (key) {
      orignalRemoveItem.apply(this, arguments as unknown as [key: string]);
      window.dispatchEvent(
        new StorageEvent('setItemEvent', {
          key: key,
        })
      );
    };

    //  下面只能在一下情况使用：另外一个页面刷新了localStorageService。数据，此时本页面能监听到事件，但是当本页面刷新数据时，这个事件监听不到。所以在本页面刷新数据set，remove，也重新发送数据
    // (scheduled([ob1, ob2, ob3], async).pipe(mergeAll())

    merge(
      fromEvent<StorageEvent>(window, 'setItemEvent'),
      fromEvent<StorageEvent>(window, 'storage')
    )
      .pipe(
        map((e) => {
          return { key: e.key!, value: e.newValue! };
        })
      )
      .subscribe(this.subject);
  }

  ngOnDestroy(): void {
    // window.removeEventListener('storage', this.storageEventListener.bind(this));
  }

  // 重写
  public setItem(newkey: string, newValue: string) {
    // this.subject.next({ key: newkey, value: newValue });
    this.storage.setItem(newkey, newValue);
  }

  public removeItem(newkey: string) {
    // this.subject.next({ key: newkey, value: null });
    this.storage.removeItem(newkey);
  }

  public getItem(key: string) {
    return this.storage.getItem(key) || undefined;
  }

  public setObject<T>(newkey: string, value: T) {
    const valuestr = JSON.stringify(value);
    this.setItem(newkey, valuestr);
  }

  public getObject<T>(key: string): T | undefined {
    const value = this.getItem(key);
    return value ? (JSON.parse(value) as T) : undefined;
  }
}
