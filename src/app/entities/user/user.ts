export class User {

  name: string;
  connected = false;

  constructor(name: string, connected: boolean) {
    this.name = name;
    this.connected = connected;
  }

}

// Firestore data converter
export const userConverter = {
  toFirestore(user): object {
    return {
      name: user.name,
      connected: user.connected
    };
  },
  fromFirestore(snapshot, options): User {
    const data = snapshot.data(options);
    return new User(data.name, data.connected);
  }
};
