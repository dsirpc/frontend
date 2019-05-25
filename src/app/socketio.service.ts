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
      this.socket = io('/cashers');
    }
    if (this.us.is_chef) {
      this.socket = io('/chefs');
    }
    if (this.us.is_barman) {
      this.socket = io('/chefs');
    }
    if (this.us.is_waiter) {
      this.socket = io('/waiters');
    }
  }

  onOrderSent(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('orderSent', (os) => {
        console.log('Socket.io order sent: ' + JSON.stringify(os));
        observer.next(os);
      });
    });
  }

  onOrderStarted(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('orderStarted', (ost) => {
        console.log('Socket.io order started: ' + JSON.stringify(ost));
        observer.next(ost);
      });
    });
  }

  onOrderCompleted(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('orderStarted', (ost) => {
        console.log('Socket.io order completed: ' + JSON.stringify(ost));
        observer.next(ost);
      });
    });
  }

  onDishCompleted(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('dishCompleted', (ost) => {
        console.log('Socket.io dish completed: ' + JSON.stringify(ost));
        observer.next(ost);
      });
    });
  }

  onTableFree(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('orderStarted', (ost) => {
        console.log('Socket.io table free: ' + JSON.stringify(ost));
        observer.next(ost);
      });
    });
  }

  onTableOccupied(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('orderStarted', (ost) => {
        console.log('Socket.io table occupied: ' + JSON.stringify(ost));
        observer.next(ost);
      });
    });
  }

}
