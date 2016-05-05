import {csrfSafe} from '../utils/csrf.js'
import {EndPoint} from './endpoint.js'
import $ from 'jquery'

/** CRUD actions for Account entity. */
export class AccountAPI {
    static createAccount(userdata) {
        return csrfSafe({
            method: "POST",
            url: EndPoint.UserList(),
            data: userdata,
        });
    }

    /** Deactivate account, so it's can't login, create events, etc.
     * @param {Integer} id account id to be closed
     */
    deactivateAccount(id) {
        return csrfSafe({
            method: "DELETE",
            url: EndPoint.userDetails(id)
        });
    }

}

export class EventAPI {
  static createEvent(data){
    return csrfSafe({
      method: "POST",
      url: EndPoint.EventList(),
      data: data
    });
  }

  static getEvents(successFn) {
    return $.ajax({
      method: "GET",
      url: EndPoint.EventList(),
      success: successFn
    });
  }

}
