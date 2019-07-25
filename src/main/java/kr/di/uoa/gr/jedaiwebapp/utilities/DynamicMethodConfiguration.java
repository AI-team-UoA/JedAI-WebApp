package kr.di.uoa.gr.jedaiwebapp.utilities;

import java.util.List;

import org.scify.jedai.blockprocessing.IBlockProcessing;
import org.scify.jedai.blockprocessing.comparisoncleaning.CanopyClustering;
import org.scify.jedai.blockprocessing.comparisoncleaning.CardinalityEdgePruning;
import org.scify.jedai.blockprocessing.comparisoncleaning.CardinalityNodePruning;
import org.scify.jedai.blockprocessing.comparisoncleaning.ComparisonPropagation;
import org.scify.jedai.blockprocessing.comparisoncleaning.ExtendedCanopyClustering;
import org.scify.jedai.blockprocessing.comparisoncleaning.ReciprocalCardinalityNodePruning;
import org.scify.jedai.blockprocessing.comparisoncleaning.ReciprocalWeightedNodePruning;
import org.scify.jedai.blockprocessing.comparisoncleaning.WeightedEdgePruning;
import org.scify.jedai.blockprocessing.comparisoncleaning.WeightedNodePruning;
import org.scify.jedai.schemaclustering.AttributeNameClustering;
import org.scify.jedai.schemaclustering.AttributeValueClustering;
import org.scify.jedai.schemaclustering.HolisticAttributeClustering;
import org.scify.jedai.schemaclustering.ISchemaClustering;
import org.scify.jedai.utilities.enumerations.RepresentationModel;
import org.scify.jedai.utilities.enumerations.SimilarityMetric;
import org.scify.jedai.utilities.enumerations.WeightingScheme;

import kr.di.uoa.gr.jedaiwebapp.models.Parameter;

public class DynamicMethodConfiguration {
	
	
    public static ISchemaClustering configureSchemaClusteringMethod(String methodName, List<Parameter> parameters) {
        ISchemaClustering processingMethod = null;

        // Get appropriate processing method
        switch (methodName) {
            case JedaiOptions.ATTRIBUTE_NAME_CLUSTERING:
                processingMethod = new AttributeNameClustering(
                		RepresentationModel.valueOf((String) parameters.get(0).getValue()),
                		SimilarityMetric.valueOf((String) parameters.get(1).getValue())
                );
                break;
            case JedaiOptions.ATTRIBUTE_VALUE_CLUSTERING:
                processingMethod = new AttributeValueClustering(
                        RepresentationModel.valueOf((String) parameters.get(0).getValue()),
                        SimilarityMetric.valueOf((String) parameters.get(1).getValue())
                );
                break;
            case JedaiOptions.HOLISTIC_ATTRIBUTE_CLUSTERING:
                processingMethod = new HolisticAttributeClustering(
                		RepresentationModel.valueOf((String) parameters.get(0).getValue()),
                        SimilarityMetric.valueOf((String) parameters.get(1).getValue())
                );
                break;
        }

        return processingMethod;
    }
    
    
    public static IBlockProcessing configureComparisonCleaningMethod(String methodName,List<Parameter> parameters) {
            
		IBlockProcessing processingMethod = null;
		
		// Get appropriate processing method
		switch (methodName) {
			case JedaiOptions.COMPARISON_PROPAGATION:
				processingMethod = new ComparisonPropagation(); // Parameter-free
				break;
			
			
			case JedaiOptions.CARDINALITY_EDGE_PRUNING:
				processingMethod = new CardinalityEdgePruning(
						WeightingScheme.valueOf((String) parameters.get(0).getValue()));
				break;
			
			case JedaiOptions.CARDINALITY_NODE_PRUNING:
				processingMethod = new CardinalityNodePruning(
						WeightingScheme.valueOf((String) parameters.get(0).getValue()));
			
				break;
			
			case JedaiOptions.WEIGHED_EDGE_PRUNING:
				processingMethod = new WeightedEdgePruning(
						WeightingScheme.valueOf((String) parameters.get(0).getValue()));
				break;
			
			case JedaiOptions.WEIGHED_NODE_PRUNING:
				processingMethod = new WeightedNodePruning(
						WeightingScheme.valueOf((String) parameters.get(0).getValue()));
				break;
			
			case JedaiOptions.RECIPROCAL_CARDINALITY_NODE_PRUNING:
				processingMethod = new ReciprocalCardinalityNodePruning(
						WeightingScheme.valueOf((String) parameters.get(0).getValue()));
				break;
			
			case JedaiOptions.RECIPROCAL_WEIGHED_NODE_PRUNING:
				processingMethod = new ReciprocalWeightedNodePruning(
						WeightingScheme.valueOf((String) parameters.get(0).getValue()));
				break;
			
			case JedaiOptions.CANOPY_CLUSTERING:
				processingMethod = new CanopyClustering(
						(double) parameters.get(0).getValue(), // Inclusive threshold
						(double) parameters.get(1).getValue()  // Exclusive threshold
				);
				break;
			
			case JedaiOptions.CANOPY_CLUSTERING_EXTENDED:
				processingMethod = new ExtendedCanopyClustering(
						(int) parameters.get(0).getValue(), // Inclusive threshold
						(int) parameters.get(1).getValue()  // Exclusive threshold
				);
				break;
		}
		
		return processingMethod;
	}

}
