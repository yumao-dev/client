// import { fromEvent, Observable, Subject } from 'rxjs';
// import { EventListenerOptions } from 'rxjs/internal/observable/fromEvent';
// import * as socketIO from 'socket.io-client';

// export class RxSocket<DT> {
//   private socket: SocketIOClient.Socket;

//   constructor(url: string, options?: SocketIOClient.ConnectOpts) {
//     this.socket = socketIO(url, options);
//   }

//   public disconnect(): void {
//     this.socket.disconnect();
//   }

//   public connect(): void {
//     this.socket.connect();
//   }

//   public observable<T = DT>(event: string, options?: EventListenerOptions): Observable<T> {
//     return this.createEventObservable<T>(event, options);
//   }

//   public subject<T = DT>(event: string): Subject<T> {
//     return this.createEventSubject<T>(event);
//   }

//   private createEventSubject<T>(event: string): Subject<T> {
//     const incoming$ = this.createEventObservable<T>(event);
//     const outgoing = {
//       next: (data: Array<T>) => {
//         this.socket.emit(event, data);
//       },
//       // ...observables: Array<ObservableInput<T>
//     };
//     // tslint:disable-next-line: deprecation
//     return Subject.create(outgoing, incoming$);
//   }

//   private createEventObservable<T>(event: string, options?: EventListenerOptions): Observable<T> {
//     // tslint:disable-next-line: deprecation
//     // return Observable.create(
//     //   (incoming: Observer<T>) => {
//     //     this.socket.on(event, (data: T) => {
//     //       incoming.next(data);
//     //     });

//     //     return () => { this.onEventSubjectUnsubscribe(event); };
//     //   });
//     return fromEvent(this.socket, event, options);
//   }

//   private onEventSubjectUnsubscribe(event: string): void {
//     // FIXME: conditional socket.disconnect or socket.removeListener
//   }

// }
