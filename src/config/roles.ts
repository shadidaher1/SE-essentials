
export enum ROLE {
    admin = "admin",
    user = "user",
    guest = "guest",
    manager = "manager"
};
export enum Permission {
    READ_ORDER = "read:order",
    WRITE_ORDER = "write:order",
    // ... other permissions
    UPDATE_ORDER = "update:order",
    DELETE_ORDER = "delete:order",
    READ_USER = "read:user",
    WRITE_USER = "write:user",
    UPDATE_USER = "update:user",
    DELETE_USER = "delete:user",
    AUTH_LOGIN = "auth:login",
    AUTH_LOGOUT = "auth:logout"

}

// This structure links Roles to the Permissions they have
export const rolePermission: Record<ROLE, Permission[]> = {
    [ROLE.admin]: [
        Permission.READ_ORDER,   // Admins can view orders
        Permission.WRITE_ORDER,  // Admins can create orders
        Permission.UPDATE_ORDER, // Admins can update orders
        Permission.DELETE_ORDER, // Admins can delete orders
        Permission.READ_USER,    // Admins can view user info
        Permission.WRITE_USER,   // Admins can create users
        Permission.UPDATE_USER,  // Admins can update users
        Permission.DELETE_USER,  // Admins can delete users
        Permission.AUTH_LOGIN,   // Admins can log in
        Permission.AUTH_LOGOUT   // Admins can log out
    ],
    [ROLE.user]: [
        Permission.WRITE_ORDER, // Users can create orders
        Permission.UPDATE_ORDER, // Users can update their orders
        Permission.READ_USER,    // Users can view user info (maybe their own?)
        Permission.AUTH_LOGIN,   // Users can log in
        Permission.AUTH_LOGOUT   // Users can log out
    ],
    [ROLE.guest]: [
        Permission.WRITE_USER, // Guests can create a user account (sign up)
        Permission.READ_ORDER, // Guests can view orders (maybe public ones?)
        Permission.AUTH_LOGIN  // Guests can log in
    ],
    [ROLE.manager]: [
        Permission.READ_ORDER,   // Managers can view orders
        Permission.WRITE_ORDER,  // Managers can create orders
        Permission.UPDATE_ORDER, // Managers can update orders
        Permission.DELETE_ORDER, // Managers can delete orders
        Permission.READ_USER,    // Managers can view user info
        Permission.AUTH_LOGIN,   // Managers can log in
        Permission.AUTH_LOGOUT   // Managers can log out
    ]
}

export const toRole = (role: string): ROLE => {
  switch (role) {
    case ROLE.admin:
      return ROLE.admin;
    case ROLE.user:
      return ROLE.user;
    case ROLE.guest:
      return ROLE.guest;
    case ROLE.manager:
      return ROLE.manager;
    default:
      throw new Error(`Invalid role: ${role}`);
  }
}