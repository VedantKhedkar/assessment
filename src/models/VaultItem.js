import { Schema, model, models } from 'mongoose';

const VaultItemSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: { type: String, required: true },
    username: { type: String, required: true },
    encryptedPassword: { type: String, required: true }, // IMPORTANT: Store encrypted password
    url: { type: String },
    notes: { type: String },
});

const VaultItem = models.VaultItem || model("VaultItem", VaultItemSchema);
export default VaultItem;