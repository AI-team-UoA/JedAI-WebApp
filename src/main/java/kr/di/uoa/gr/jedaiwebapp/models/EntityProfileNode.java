package kr.di.uoa.gr.jedaiwebapp.models;

import org.scify.jedai.datamodel.EntityProfile;

public class EntityProfileNode {
	private EntityProfile entity;
	private int id;
	
	public EntityProfileNode(EntityProfile entity, int id){
		this.entity = entity;
		this.id = id;
	}
	
	public EntityProfile getProfile() {
		return entity;
	}
	public void setProfile(EntityProfile entity) {
		this.entity = entity;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	

}
