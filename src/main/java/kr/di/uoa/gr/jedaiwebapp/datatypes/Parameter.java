package kr.di.uoa.gr.jedaiwebapp.datatypes;

public class Parameter {
		private String label;
		private Object value;
		
		public Parameter() {}
		
		public Parameter(String p) {
			String[] str = p.split("|");
			this.label = str[0];
			this.value = str[1];
		}
		
		public String getLabel() {
			return label;
		}
		public void setLabel(String label) {
			this.label = label;
		}
		public Object getValue() {
			return value;
		}
		public void setValue(Object value) {
			this.value = value;
		}
		
}
