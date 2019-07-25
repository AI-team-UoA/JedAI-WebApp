package kr.di.uoa.gr.jedaiwebapp.utilities;

import org.scify.jedai.schemaclustering.AttributeValueClustering;
import org.scify.jedai.schemaclustering.HolisticAttributeClustering;
import org.scify.jedai.schemaclustering.ISchemaClustering;
import org.scify.jedai.utilities.enumerations.RepresentationModel;
import org.scify.jedai.utilities.enumerations.SimilarityMetric;
import org.scify.jedai.utilities.enumerations.WeightingScheme;
import org.scify.jedai.blockprocessing.IBlockProcessing;
import org.scify.jedai.blockprocessing.blockcleaning.BlockFiltering;
import org.scify.jedai.blockprocessing.blockcleaning.ComparisonsBasedBlockPurging;
import org.scify.jedai.blockprocessing.blockcleaning.SizeBasedBlockPurging;
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



public class MethodConfigurations {
	
	
	
	public static ISchemaClustering getSchemaClusteringMethodByName(String methodName) {
        ISchemaClustering schemaClustering = null;

        switch (methodName) {
            case JedaiOptions.ATTRIBUTE_NAME_CLUSTERING:
                schemaClustering = new AttributeNameClustering(
                        RepresentationModel.CHARACTER_TRIGRAMS, SimilarityMetric.ENHANCED_JACCARD_SIMILARITY);
                break;
            case JedaiOptions.ATTRIBUTE_VALUE_CLUSTERING:
                schemaClustering = new AttributeValueClustering(
                        RepresentationModel.CHARACTER_TRIGRAMS, SimilarityMetric.ENHANCED_JACCARD_SIMILARITY);
                break;
            case JedaiOptions.HOLISTIC_ATTRIBUTE_CLUSTERING: 
                schemaClustering = new HolisticAttributeClustering(
                        RepresentationModel.CHARACTER_TRIGRAMS, SimilarityMetric.ENHANCED_JACCARD_SIMILARITY);
                break;
            default:
            	System.out.println("ERROR: Schema clustering method does not exist: " + methodName);
        }

        return schemaClustering;
    }
	
	
	
	public static IBlockProcessing getMethodByName(String method) {
        IBlockProcessing processingMethod = null;

        // Get appropriate processing method
        switch (method) {
            // Block Building methods
            case JedaiOptions.BLOCK_FILTERING:
                processingMethod = new BlockFiltering();
                break;
            case JedaiOptions.SIZE_BASED_BLOCK_PURGING:
                processingMethod = new SizeBasedBlockPurging();
                break;
            case JedaiOptions.COMPARISON_BASED_BLOCK_PURGING:
                processingMethod = new ComparisonsBasedBlockPurging();
                break;
            // Below: Comparison Cleaning methods
            case JedaiOptions.COMPARISON_PROPAGATION:
                processingMethod = new ComparisonPropagation();
                break;
            case JedaiOptions.CARDINALITY_EDGE_PRUNING:
                processingMethod = new CardinalityEdgePruning(WeightingScheme.ECBS);
                break;
            case JedaiOptions.CARDINALITY_NODE_PRUNING:
                processingMethod = new CardinalityNodePruning(WeightingScheme.ECBS);
                break;
            case JedaiOptions.WEIGHED_EDGE_PRUNING:
                processingMethod = new WeightedEdgePruning(WeightingScheme.ECBS);
                break;
            case JedaiOptions.WEIGHED_NODE_PRUNING:
                processingMethod = new WeightedNodePruning(WeightingScheme.ECBS);
                break;
            case JedaiOptions.RECIPROCAL_CARDINALITY_NODE_PRUNING:
                processingMethod = new ReciprocalCardinalityNodePruning(WeightingScheme.ECBS);
                break;
            case JedaiOptions.RECIPROCAL_WEIGHED_NODE_PRUNING:
                processingMethod = new ReciprocalWeightedNodePruning(WeightingScheme.ECBS);
                break;
            case JedaiOptions.CANOPY_CLUSTERING:
                processingMethod = new CanopyClustering();
                break;
            case JedaiOptions.CANOPY_CLUSTERING_EXTENDED:
                processingMethod = new ExtendedCanopyClustering();
                break;
            default:
            	System.out.println("ERROR: getMethodByName method does not exist: " + method);
        }

        // Return the method
        return processingMethod;
    }

}
