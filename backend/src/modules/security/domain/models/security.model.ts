import AddressModel from "src/modules/user/domain/models/address.model";
import DeviceModel from "src/modules/user/domain/models/device.model";
import NotificationModel from "src/modules/user/domain/models/notification.model";
import ProfileModel from "src/modules/user/domain/models/profile.model";
import SessionModel from "src/modules/user/domain/models/session.model";
import UserModel from "src/modules/user/domain/models/user.model";

export default class SecurityModel {
    private AddressModel: AddressModel;
    private DeviceModel: DeviceModel;
    private ProfileModel: ProfileModel;
    private SessionModel: SessionModel;
    private UserModel: UserModel;
    private NotificationModel: NotificationModel;

    constructor() {
        this.AddressModel = new AddressModel();
        this.DeviceModel = new DeviceModel();
        this.ProfileModel = new ProfileModel();
        this.SessionModel = new SessionModel();
        this.UserModel = new UserModel();
        this.NotificationModel = new NotificationModel();
    }

    public user() {
        return {
            name: "user",
            permits: [
                this.AddressModel.permits.create,
                this.AddressModel.permits.delete,
                this.AddressModel.permits.read,
                this.AddressModel.permits.update,
                this.DeviceModel.permits.create,
                this.DeviceModel.permits.read,
                this.DeviceModel.permits.update,
                this.ProfileModel.permits.create,
                this.ProfileModel.permits.read,
                this.ProfileModel.permits.update,
                this.SessionModel.permits.create,
                this.SessionModel.permits.read,
                this.UserModel.permits.read,
                this.NotificationModel.permits.create,
                this.NotificationModel.permits.delete,
                this.NotificationModel.permits.read,
                this.NotificationModel.permits.update,
                this.NotificationModel.permits.list,
                this.AddressModel.permits.list,
            ]
        }
    }

    public admin() {
        return {
            name: "admin",
            permits: [
                this.AddressModel.permits.create,
                this.AddressModel.permits.delete,
                this.AddressModel.permits.read,
                this.AddressModel.permits.update,
                this.SessionModel.permits.create,
                this.SessionModel.permits.delete,
                this.SessionModel.permits.read,
                this.SessionModel.permits.update,
                this.UserModel.permits.create,
                this.UserModel.permits.delete,
                this.UserModel.permits.read,
                this.UserModel.permits.update,
                this.NotificationModel.permits.create,
                this.NotificationModel.permits.delete,
                this.NotificationModel.permits.read,
                this.NotificationModel.permits.update,
                this.AddressModel.permits.list,
                this.SessionModel.permits.list,
                this.UserModel.permits.list,
                this.NotificationModel.permits.list,
            ]
        }
    }
}
