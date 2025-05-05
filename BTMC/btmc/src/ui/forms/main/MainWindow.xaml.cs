using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace LowLevelLanguageCalculator
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Close_Click(object sender, RoutedEventArgs e) => this.Close();
        private void Minimize_Click(object sender, RoutedEventArgs e) => this.WindowState = WindowState.Minimized;

        private void BTMC_Click(object sender, RoutedEventArgs e)
        {
            BTMCButton.Background = new SolidColorBrush(Color.FromRgb(170, 170, 170));
            BTMCButton.Foreground = Brushes.White;
            TERNButton.Background = Brushes.Transparent;
            TERNButton.Foreground = Brushes.Gray;
        }

        private void TERN_Click(object sender, RoutedEventArgs e)
        {
            TERNButton.Background = new SolidColorBrush(Color.FromRgb(170, 170, 170));
            TERNButton.Foreground = Brushes.White;
            BTMCButton.Background = Brushes.Transparent;
            BTMCButton.Foreground = Brushes.Gray;
        }

        private void Convert_Click(object sender, RoutedEventArgs e)
        {
            int val1, val2;
            if (!int.TryParse(Input1Box.Text, out val1) || !int.TryParse(Input2Box.Text, out val2))
            {
                OutputBox.Text = "Invalid input";
                return;
            }

            var selected = InstructionComboBox.SelectedItem as ComboBoxItem;
            if (selected == null || selected.Content.ToString() == "select")
            {
                OutputBox.Text = "Select instruction";
                return;
            }

            string instruction = selected.Content.ToString();
            int result = 0;

            if (instruction == "ADD") result = val1 + val2;
            else if (instruction == "SUB") result = val1 - val2;
            else if (instruction == "MUL") result = val1 * val2;
            else if (instruction == "DIV") result = val2 != 0 ? val1 / val2 : 0;

            OutputBox.Text = result.ToString();
        }
    }
}
