import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import * as io from 'socket.io-client';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  private socket;
  constructor(private us: UserService) { }

  connect(): void {
    if (this.us.is_casher) {
      this.socket = io(this.us.url + '/cashers');
    }
    if (this.us.is_chef) {
      this.socket = io(this.us.url + '/chefs');
    }
    if (this.us.is_barman) {
      this.socket = io(this.us.url + '/chefs');
    }
    if (this.us.is_waiter) {
      this.socket = io(this.us.url + '/waiters');
    }
  }

  onOrderSent(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('orderSent', (os) => {
        console.log('Socket.io order sent: ' + JSON.stringify(os));
        observer.next(os);
      });

      this.socket.on('error', (err) => {
        console.log('Socket.io error: ' + err );
        observer.error( err );
      });

      // When the consumer unsubscribes, clean up data ready for next subscription.
      return { unsubscribe() {
        this.socket.disconnect();
      }};
    });
  }

  onOrderStarted(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('orderStarted', (ost) => {
        console.log('Socket.io order started: ' + JSON.stringify(ost));
        observer.next(ost);
      });

      this.socket.on('error', (err) => {
        console.log('Socket.io error: ' + err );
        observer.error( err );
      });

      // When the consumer unsubscribes, clean up data ready for next subscription.
      return { unsubscribe() {
        this.socket.disconnect();
      }};
    });
  }

  onOrderCompleted(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('orderCompleted', (ost) => {
        console.log('Socket.io order completed: ' + JSON.stringify(ost));
        observer.next(ost);
      });

      this.socket.on('error', (err) => {
        console.log('Socket.io error: ' + err );
        observer.error( err );
      });

      // When the consumer unsubscribes, clean up data ready for next subscription.
      return { unsubscribe() {
        this.socket.disconnect();
      }};
    });
  }

  onDishCompleted(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('dishCompleted', (ost) => {
        console.log('Socket.io dish completed: ' + JSON.stringify(ost));
        observer.next(ost);
      });

      this.socket.on('error', (err) => {
        console.log('Socket.io error: ' + err );
        observer.error( err );
      });

      // When the consumer unsubscribes, clean up data ready for next subscription.
      return { unsubscribe() {
        this.socket.disconnect();
      }};
    });
  }

  onTableFree(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('tableFree', (ost) => {
        console.log('Socket.io table free: ' + JSON.stringify(ost));
        observer.next(ost);
      });

      this.socket.on('error', (err) => {
        console.log('Socket.io error: ' + err );
        observer.error( err );
      });

      // When the consumer unsubscribes, clean up data ready for next subscription.
      return { unsubscribe() {
        this.socket.disconnect();
      } };
    });
  }

  onTableOccupied(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('tableOccupied', (ost) => {
        console.log('Socket.io table occupied: ' + JSON.stringify(ost));
        observer.next(ost);
      });

      this.socket.on('error', (err) => {
        console.log('Socket.io error: ' + err );
        observer.error( err );
      });

      // When the consumer unsubscribes, clean up data ready for next subscription.
      return { unsubscribe() {
        this.socket.disconnect();
      }};
    });
  }
}
