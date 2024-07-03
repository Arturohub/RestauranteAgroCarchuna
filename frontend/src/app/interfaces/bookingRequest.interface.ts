export interface BookingRequest {
    id: number;
    userBooker: {
        username: string;
      };
    date: string;
    turno: string;
    time: string;
    amountPeople: number;
    createdAt: string;
    updatedAt: string;
}

