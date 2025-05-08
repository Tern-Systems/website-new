using System.Windows;
using System.Windows.Controls;

namespace btmc.src.ui.forms.main.tabs.T_TERN
{
    public partial class TERN : UserControl
    {
        public static readonly DependencyProperty InstructionOperationProperty =
            DependencyProperty.Register("InstructionOperation", typeof(object), typeof(TERN),
                new FrameworkPropertyMetadata(null, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault));

        public static readonly DependencyProperty Input1ValueProperty =
            DependencyProperty.Register("Input1Value", typeof(string), typeof(TERN),
                new FrameworkPropertyMetadata(string.Empty, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault));

        public static readonly DependencyProperty Input2ValueProperty =
            DependencyProperty.Register("Input2Value", typeof(string), typeof(TERN),
                new FrameworkPropertyMetadata(string.Empty, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault));

        public static readonly DependencyProperty OutputValueProperty =
            DependencyProperty.Register("OutputValue", typeof(string), typeof(TERN),
                new FrameworkPropertyMetadata(string.Empty, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault));

        public object InstructionOperation
        {
            get { return GetValue(InstructionOperationProperty); }
            set { SetValue(InstructionOperationProperty, value); }
        }

        public string Input1Value
        {
            get { return (string)GetValue(Input1ValueProperty); }
            set { SetValue(Input1ValueProperty, value); }
        }

        public string Input2Value
        {
            get { return (string)GetValue(Input2ValueProperty); }
            set { SetValue(Input2ValueProperty, value); }
        }

        public string OutputValue
        {
            get { return (string)GetValue(OutputValueProperty); }
            set { SetValue(OutputValueProperty, value); }
        }

        public TERN()
        {
            InitializeComponent();
        }

        private void SwapButton_SwapClicked(object sender, RoutedEventArgs e)
        {
            var temp = Input1Value;
            Input1Value = Input2Value;
            Input2Value = temp;
        }

        public void ClearInputs()
        {
            InstructionOperation = null;
            Input1Value = string.Empty;
            Input2Value = string.Empty;
            OutputValue = string.Empty;
        }
    }
}
