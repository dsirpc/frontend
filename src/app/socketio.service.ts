import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import * as io from 'socket.io-client';
import { JsonPipe } from '@angular/common';
import { userInfo } from 'os';
const io2 = require('socket.io-client');

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  private socket;
  constructor(private us: UserService) { }

  connect(): Observable<any> {
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

    return new Observable((observer) => {
      this.socket.on('orderSent', (os) => {
        console.log('Socket.io order sent: ' + JSON.stringify(os));
        observer.next(os);
      });

      this.socket.on('orderCompleted', (oc) => {
        console.log('Socket.io order completed: ' + JSON.stringify(oc));
        observer.next(oc);
      });

      this.socket.on('dishCompleted', (dc) => {
        console.log('Socket.io dish completed: ' + JSON.stringify(dc));
        observer.next(dc);
      });

      this.socket.on('tableOccupied', (to) => {
        console.log('Socket.io table occupied: ' + JSON.stringify(to));
        observer.next(to);
      });

      this.socket.on('tableFree', (tf) => {
        console.log('Socket.io table free: ' + JSON.stringify(tf));
        observer.next(tf);
      });

      this.socket.on('tableCreated', (tc) => {
        console.log('Socket.io table created: ' + JSON.stringify(tc));
        observer.next(tc);
      });

      this.socket.on('error', (err) => {
        console.log('Socket.io error: ' + err );
        observer.error( err );
      });

      return { unsubscribe() {
        this.socket.disconnect();
      }};
    });
  }
}
