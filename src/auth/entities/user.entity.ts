import { Prop, SchemaFactory } from "@nestjs/mongoose";

export class User {

	
	//_id: string;
	@Prop({ unique: true, required:true })
	email: string;
	
	@Prop({ required:true })
	name: string;
	
	@Prop({ minLength: 6, required: true })
	password: string;
	
	@Prop({ default: true })
	isActive: boolean;
	
	@Prop({ type: [ String ], default: [ 'user' ] })
	rol: string[];
}

export const UserSchema = SchemaFactory.createForClass( User )