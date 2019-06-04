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
  // private casherSocket;
  // private waiterSocket;
  // private chefSocket;
  // private barmanSocket;
  constructor(private us: UserService) { }

  connect(): void {
    if (this.us.is_casher()) {
      this.socket = io(this.us.url + '/cashers');
    }
    if (this.us.is_chef()) {
      this.socket = io(this.us.url + '/chefs');
    }
    if (this.us.is_barman()) {
      this.socket = io(this.us.url + '/chefs');
    }
    if (this.us.is_waiter()) {
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

  onOrderFoodStarted(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('orderFoodStarted', (ofs) => {
        console.log('Socket.io order started: ' + JSON.stringify(ofs));
        observer.next(ofs);
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

  onOrderDrinkStarted(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('orderDrinkStarted', (ost) => {
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

  onOrderFoodCompleted(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('orderFoodCompleted', (ost) => {
        console.log('Socket.io order food completed: ' + JSON.stringify(ost));
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

  onOrderDrinkCompleted(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('orderDrinkCompleted', (ost) => {
        console.log('Socket.io order drink completed: ' + JSON.stringify(ost));
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
