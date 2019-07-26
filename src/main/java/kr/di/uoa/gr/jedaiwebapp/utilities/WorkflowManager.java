package kr.di.uoa.gr.jedaiwebapp.utilities;

import java.util.HashMap;
import java.util.List;

import org.scify.jedai.blockbuilding.IBlockBuilding;
import org.scify.jedai.blockprocessing.IBlockProcessing;
import org.scify.jedai.datamodel.EntityProfile;
import org.scify.jedai.entityclustering.IEntityClustering;
import org.scify.jedai.entitymatching.IEntityMatching;
import org.scify.jedai.schemaclustering.ISchemaClustering;

import kr.di.uoa.gr.jedaiwebapp.models.DataReadModel;

public class WorkflowManager {
	
	public static  String er_mode;
	public static List<EntityProfile> profilesD1;
	public static List<EntityProfile> profilesD2;
	public static DataReadModel ground_truth;

	public static ISchemaClustering schema_clustering;
	public static IBlockProcessing comparison_cleaning;
	public static IEntityMatching entity_matching;
	public static IEntityClustering entity_clustering;
	public static List<IBlockBuilding> block_building;
	public static List<IBlockProcessing> block_cleaning;
	
	WorkflowManager(){
		WorkflowManager.er_mode = null;
		WorkflowManager.profilesD1 = null;
		WorkflowManager.profilesD2 = null;
		WorkflowManager.ground_truth = null;
		WorkflowManager.schema_clustering = null;
		WorkflowManager.comparison_cleaning = null;
		WorkflowManager.entity_matching = null;
		WorkflowManager.entity_clustering = null;
		WorkflowManager.block_building = null;
		WorkflowManager.block_cleaning = null;
		
	}
	
	
}
