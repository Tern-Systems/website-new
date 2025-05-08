using System.Windows;
using System.Windows.Controls;

namespace btmc.src.ui.forms.main.tabs.T_BTMC
{
    public partial class BTMC : UserControl
    {
        public static readonly DependencyProperty InputOperationProperty =
            DependencyProperty.Register("InputOperation", typeof(object), typeof(BTMC),
                new FrameworkPropertyMetadata(null, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault));

        public static readonly DependencyProperty OutputOperationProperty =
            DependencyProperty.Register("OutputOperation", typeof(object), typeof(BTMC),
                new FrameworkPropertyMetadata(null, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault));

        public static readonly DependencyProperty InputValueProperty =
            DependencyProperty.Register("InputValue", typeof(string), typeof(BTMC),
                new FrameworkPropertyMetadata(string.Empty, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault));

        public static readonly DependencyProperty OutputValueProperty =
            DependencyProperty.Register("OutputValue", typeof(string), typeof(BTMC),
                new FrameworkPropertyMetadata(string.Empty, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault));

        public object InputOperation
        {
            get { return GetValue(InputOperationProperty); }
            set { SetValue(InputOperationProperty, value); }
        }

        public object OutputOperation
        {
            get { return GetValue(OutputOperationProperty); }
            set { SetValue(OutputOperationProperty, value); }
        }

        public string InputValue
        {
            get { return (string)GetValue(InputValueProperty); }
            set { SetValue(InputValueProperty, value); }
        }

        public string OutputValue
        {
            get { return (string)GetValue(OutputValueProperty); }
            set { SetValue(OutputValueProperty, value); }
        }

        public BTMC()
        {
            InitializeComponent();
        }

        private void SwapButton_SwapClicked(object sender, RoutedEventArgs e)
        {
            var temp = InputOperation;
            InputOperation = OutputOperation;
            OutputOperation = temp;
        }
    }
}
