import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkflow extends Document {
  name: string;
  description: string;
  nodes: any[];
  edges: any[];
  userId: Schema.Types.ObjectId;
  version: number;
}

const WorkflowSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  nodes: [{ type: Schema.Types.Mixed }],
  edges: [{ type: Schema.Types.Mixed }],
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  version: { type: Number, default: 1 }
}, { timestamps: true });

export default mongoose.model<IWorkflow>('Workflow', WorkflowSchema);