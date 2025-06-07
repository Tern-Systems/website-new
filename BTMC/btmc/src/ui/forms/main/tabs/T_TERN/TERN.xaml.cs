using btmc.src.alu;
using btmc.src.ui.forms.main.components;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace btmc.src.ui.forms.main.tabs.T_TERN
{
    using OperationEntry = KeyValuePair<ALU.Operation, string>;

    /// <summary>
    /// Interaction logic for TERN.xaml
    /// </summary>
    public partial class TERN : UserControl
    {
        public List<OperationEntry> Operations { get; }
        public Utils.TypePatternEntry TextBoxPattern { get; }

        public TERN()
        {
            InitializeComponent();
        }

        public void ClearFields()
        {
            Input1TextBox.Text = string.Empty;
            Input2TextBox.Text = string.Empty;
            OutputTextBox.Text = string.Empty;
            RestorePlaceholder(Input1TextBox, null);
            RestorePlaceholder(Input2TextBox, null);
            RestorePlaceholder(OutputTextBox, null);
            if (InstructionComboBox != null) InstructionComboBox.SelectedIndex = 0;
        }

        private void BtnSwap_Click(object sender, RoutedEventArgs e)
        {
            /* Uncomment after you add the required TextBoxes to the form */
            //Swap.SwapInputs(ref tbTERN_In_1, ref tbTERN_In_2);
        }

        private void RemovePlaceholder(object sender, RoutedEventArgs e)
        {
            if (sender is TextBox textBox && textBox.Foreground.ToString() == "#FFB3B3B3")
            {
                textBox.Text = string.Empty;
                textBox.Foreground = Brushes.White;
            }
        }

        private void RestorePlaceholder(object sender, RoutedEventArgs e)
        {
            if (sender is TextBox textBox && string.IsNullOrWhiteSpace(textBox.Text))
            {
                if (textBox.Name == "Input1TextBox") textBox.Text = "input 1...";
                else if (textBox.Name == "Input2TextBox") textBox.Text = "input 2...";
                else if (textBox.Name == "OutputTextBox") textBox.Text = "output...";
                textBox.Foreground = (Brush)new BrushConverter().ConvertFrom("{StaticResource Color.Gray.179}");
            }
        }
    }
}
