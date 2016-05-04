
export class EndPoint {

    static UserList()        { return '/api/users/'        }
    static UserDetail(id)    { return `/api/users/${id}`   }

    static EventList()       { return '/api/events/'       }
    static EventDetail(id)   { return `/api/events/${id}`  }

    static TransactionList() { return '/api/transactions/' }

}
